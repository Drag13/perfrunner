import puppeteer, { Browser, Page } from 'puppeteer';
import { debug, log } from '../logger';
import { NetworkSetup } from './perf-options';
import { Tracer } from './trace';
import { setpPerformanceConditions } from './setup';
import { extractPerformanceMetrics } from './extractor';
import { iterateAsync, asyncToArray } from '../utils';

type ProfileParams = {
    useCache: boolean;
    url: URL;
    throttlingRate: number;
    network: NetworkSetup;
    waitFor: number | string | undefined;
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

async function runApplication(url: URL, page: Page, waitFor?: string | number) {
    debug('launching the app');
    await page.goto(url.href, { waitUntil: 'networkidle0' });
    if (typeof waitFor === 'number' && waitFor != 0 && !isNaN(waitFor)) {
        debug(`waiting for timer: ${waitFor} the app`);
        await page.waitFor(waitFor);
    }
    if (typeof waitFor === 'string' && waitFor.trim() !== '') {
        debug(`waiting for selector: ${waitFor} the app`);
        await page.waitForSelector(waitFor);
    }
}

async function newPage(browser: Browser, timeout: number) {
    const newPage = await browser.newPage();
    newPage.setDefaultTimeout(timeout);
    return newPage;
}

async function profilePage(browser: Browser, profileParams: ProfileParams, outputTracesTo: string, timeout: number) {
    const { useCache, url, throttlingRate, network, waitFor } = profileParams;

    const tracer = new Tracer(outputTracesTo);
    const page = await newPage(browser, timeout);

    await setpPerformanceConditions(page, { useCache, throttlingRate, network });

    await tracer.start(page);
    await runApplication(url, page, waitFor);
    const trace = await tracer.stop();

    const result = await extractPerformanceMetrics(page, trace);
    await page.close();

    return result;
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
