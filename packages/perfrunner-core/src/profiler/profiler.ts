import puppeteer, { Browser, Page } from 'puppeteer';
import { debug, log } from '../logger';
import { NetworkSetup } from './perf-options';
import { Tracer } from './trace';
import { setpPerformanceConditions } from './setup';
import { extractPerformanceMetrics } from './extractor';
import { iterateAsync } from '../utils';

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

async function prepareBrowser(url: URL, pageInstance: Page) {
    debug('warming up page');
    await pageInstance.goto(url.href, { waitUntil: 'networkidle0' });
    debug('warming finished, closing page');
    await pageInstance.close();
}

async function runApplication(url: URL, page: Page, waitFor?: string | number) {
    debug('launching the app');
    await page.goto(url.href, { waitUntil: 'networkidle0' });
    if (typeof waitFor === 'number' && waitFor != 0 && !isNaN(waitFor)) {
        await page.waitFor(waitFor);
    }
    if (typeof waitFor === 'string' && waitFor.trim() !== '') {
        await page.waitForSelector(waitFor);
    }
}

async function profilePage(browser: Browser, profileParams: ProfileParams, outputTracesTo: string) {
    const { useCache, url, throttlingRate, network, waitFor } = profileParams;

    await prepareBrowser(url, await browser.newPage());

    const tracer = new Tracer(outputTracesTo);
    const newPage = await browser.newPage();

    await setpPerformanceConditions(newPage, { useCache, throttlingRate, network });

    await tracer.start(newPage);
    await runApplication(url, newPage, waitFor);
    const trace = await tracer.stop();

    const result = await extractPerformanceMetrics(newPage, trace);
    await newPage.close();

    return result;
}
export async function runProfilingSession(
    browserLaunchOptions: BrowserLaunchOptions,
    profileOptions: ProfileParams,
    numberOfRuns: number,
    outputTracesTo: string
) {
    const { args, headless, timeout, ignoreDefaultArgs, product, executablePath } = browserLaunchOptions;

    debug(`running chrome with args: ${args && args.length ? args : `no args provided`}`);

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

        const params = new Array(numberOfRuns).fill(profileOptions);

        const resultSequence = iterateAsync(params, (options, i) => {
            log(`running test #${i + 1}`);
            return profilePage(browser!, options, outputTracesTo);
        });

        const perfromanceData = [];

        for await (const result of resultSequence) {
            perfromanceData.push(result);
        }

        return perfromanceData;
    } finally {
        if (browser) {
            browser.close();
        }
    }
}
