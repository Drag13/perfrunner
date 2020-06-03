import puppeteer, { Page, Browser } from 'puppeteer';
import { RawPerfData } from './raw-perf-data';
import { PerfRunnerOptions, PerfOptions } from './perf-options';
import { report } from '../log';

async function startBrowser(timeout: number, headless: boolean) {
    return await puppeteer.launch({ headless, timeout, ignoreHTTPSErrors: true });
}

async function startEmptyPage(browser: Browser) {
    return await browser.newPage();
}

async function setupPerformanceConditions(page: Page, { network, throttlingRate, useCache }: PerfOptions) {

    const session = await page.target().createCDPSession()

    if (!useCache) {
        await page.setCacheEnabled(false);
        await session.send('Network.setCacheDisabled', { cacheDisabled: true, });
    } else {
        await page.setCacheEnabled(true);
    }

    await session.send('Network.enable');
    await session.send('Emulation.setCPUThrottlingRate', { rate: throttlingRate });
    await session.send('Network.emulateNetworkConditions', network);
    await session.send('Performance.enable');

    return session;
}

async function startApplication(page: Page, url: string, waitFor?: string | number) {
    await page.goto(url, { waitUntil: "networkidle2" });
    if (typeof waitFor === 'number') { await page.waitFor(waitFor) };
    if (typeof waitFor === 'string') { await page.waitForSelector(waitFor); }
}

async function dumpMetrics(page: Page) {
    const performanceEntries: PerformanceEntry[] = JSON.parse(await page.evaluate(() => JSON.stringify(performance.getEntries())));
    const metrics = await page.metrics();

    return {
        metrics,
        performanceEntries
    };
}

async function* profilePage(emptyPage: Page, url: string, runs: number, waitFor: string | number | undefined) {
    for (let index = 0; index < runs; index++) {
        await startApplication(emptyPage, url, waitFor);
        yield (await dumpMetrics(emptyPage));
    }
}

export async function profile(options: PerfRunnerOptions): Promise<RawPerfData[]> {
    const { useCache, url, waitFor, runs } = options;
    const browser = await startBrowser(options.timeout, options.headless);
    const result = [];

    try {

        const page = await startEmptyPage(browser);
        await setupPerformanceConditions(page, options);

        if (useCache) { // warm up application
            report(`warming up cache`)
            await startApplication(page, url.href, waitFor)
        }

        let i = 0;

        for await (const dump of profilePage(page, url.href, runs, waitFor)) {
            result.push(dump)
            i++;
            report(`running #${i} profile session`);
        }

        return result;
    }
    catch (e) { console.log(e); throw (e) }
    finally { browser.close(); }
}