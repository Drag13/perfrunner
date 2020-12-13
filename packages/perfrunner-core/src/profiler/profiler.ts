import puppeteer, { Browser, Page } from 'puppeteer';
import { debug, log } from '../logger';
import { NetworkSetup } from './perf-options';
import { Tracer } from './trace';
import { setpPerformanceConditions } from './setup';
import { extractPerformanceMetrics } from './extractor';
import { iterateAsync, asyncToArray } from '../utils';
import { LARGEST_CONTENTFUL_PAINT } from './performance-observers';

const MAX_RETRIES = 1;

type ProfileParams = {
    useCache: boolean;
    url: URL;
    throttlingRate: number;
    network: NetworkSetup;
    waitFor?: number | string;
    afterPageLoaded?: () => any;
};

type BrowserLaunchOptions = {
    headless: boolean;
    timeout: number;
    ignoreDefaultArgs: boolean;
    args: string[] | undefined;
    product: 'chrome';
    executablePath: string | undefined;
};

async function warmingBrowser(url: URL, pageInstance: Page) {
    debug('warming up page');
    await pageInstance.goto(url.href, { waitUntil: 'networkidle0' });
    debug('warming finished, closing page');
    await pageInstance.close();
}

type PageRunOptions = { waitFor?: string | number; afterPageLoaded?: () => any };

async function runApplication(url: URL, page: Page, options?: PageRunOptions) {
    debug('launching the app');
    const { waitFor, afterPageLoaded } = options || {};

    await page.goto(url.href, { waitUntil: 'networkidle0' });

    if (typeof waitFor === 'number' && waitFor != 0 && !isNaN(waitFor)) {
        debug(`waiting for timer: ${waitFor} the app`);
        await page.waitFor(waitFor);
    }
    if (typeof waitFor === 'string' && waitFor.trim() !== '') {
        debug(`waiting for selector: ${waitFor} the app`);
        await page.waitForSelector(waitFor);
    }

    if (typeof afterPageLoaded === 'function') {
        await page.evaluate(afterPageLoaded);
    }
}

async function newPage(browser: Browser, timeout: number) {
    const newPage = await browser.newPage();
    newPage.setDefaultTimeout(timeout);
    return newPage;
}

type ProfileResult = Promise<{
    metrics: puppeteer.Metrics;
    performanceEntries: PerformanceEntry[];
}>;

async function profilePage(browser: Browser, params: ProfileParams, traceTo: string, timeout: number, retries = 0): ProfileResult {
    const { useCache, url, throttlingRate, network, waitFor, afterPageLoaded } = params;
    const tracer = new Tracer(traceTo);
    let page: Page | null = null;
    try {
        page = await newPage(browser, timeout);

        await setpPerformanceConditions(page, { useCache, throttlingRate, network });

        await tracer.start(page);
        await runApplication(url, page, { waitFor, afterPageLoaded });
        const trace = await tracer.stop();

        const result = await extractPerformanceMetrics(page, trace);
        await page.close();

        const fcp = result.performanceEntries.find((x) => x.name === 'first-contentful-paint');
        debug(`fcp: ${fcp ? fcp.startTime : 'not recorded'}`);

        const lcp = result.performanceEntries.find((x) => x.entryType === LARGEST_CONTENTFUL_PAINT);
        log(`lcp: ${lcp ? lcp.startTime : 'not recorded'}`);

        return result;
    } catch (error) {
        if (page) {
            await page.close();
        }

        if (retries < MAX_RETRIES) {
            log(`Spotted an error, doing retry #${retries + 1}`);
            return await profilePage(browser, params, traceTo, timeout, retries + 1);
        }

        log(`Retrying limit exceeded, aborting profiling`);
        throw error;
    }
}
export async function runProfilingSession(
    browserLaunchOptions: BrowserLaunchOptions,
    profileOptions: ProfileParams,
    numberOfRuns: number,
    outputTracesTo: string
) {
    const { args, headless, timeout, ignoreDefaultArgs, product, executablePath } = browserLaunchOptions;

    debug(`starting browser with args: ${args && args.length ? args : `no args provided`}`);

    let browser: Browser | null = null;

    try {
        browser = await puppeteer.launch({
            headless,
            timeout,
            ignoreHTTPSErrors: true,
            ignoreDefaultArgs,
            args,
            product,
            executablePath,
        });

        // We need only one warmup for the browser
        await warmingBrowser(profileOptions.url, await newPage(browser, timeout));

        const params = new Array(numberOfRuns).fill(profileOptions);

        const resultSequence = iterateAsync(params, (options, i) => {
            log(`running test #${i + 1}`);
            return profilePage(browser!, options, outputTracesTo, timeout);
        });

        return await asyncToArray(resultSequence);
    } finally {
        if (browser) {
            browser.close();
        }
    }
}
