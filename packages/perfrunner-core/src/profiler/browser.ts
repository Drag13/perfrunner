import puppeteer, { Page, Browser } from 'puppeteer';
import { PerfOptions } from './perf-options';
import { measureLCP, setupObserversStorage, IWithObserver } from './performance-observers';
import { debug } from '../utils';
import { ExtendedPerformanceEntry } from './types';

export async function startBrowser(timeout: number, headless?: boolean, ignoreDefaultArgs?: boolean, args?: string[]) {
    debug(`running chrome with args: ${args && args.length ? args : `no args provided`}`);
    return await puppeteer.launch({ headless, timeout, ignoreHTTPSErrors: true, ignoreDefaultArgs, args });
}

export async function startEmptyPage(browser: Browser) {
    return await browser.newPage();
}

export async function setupPerformanceConditions(page: Page, { network, throttlingRate, useCache }: PerfOptions) {
    const session = await page.target().createCDPSession();

    if (!useCache) {
        await page.setCacheEnabled(false);
        await session.send('Network.setCacheDisabled', { cacheDisabled: true });
    } else {
        await page.setCacheEnabled(true);
    }

    await session.send('Performance.enable');

    await session.send('Network.enable');
    await session.send('Emulation.setCPUThrottlingRate', { rate: throttlingRate });
    await session.send('Network.emulateNetworkConditions', { ...network, offline: false }); // https://chromedevtools.github.io/devtools-protocol/tot/Network/#method-emulateNetworkConditions

    return session;
}

export async function setupPerformanceObservers(page: Page) {
    await page.evaluateOnNewDocument(setupObserversStorage);
    await page.evaluateOnNewDocument(measureLCP);
}

export async function startApplication(page: Page, url: string, waitFor?: string | number) {
    await page.goto(url, { waitUntil: 'networkidle2' });
    if (typeof waitFor === 'number' && waitFor != 0 && !isNaN(waitFor)) {
        await page.waitFor(waitFor);
    }
    if (typeof waitFor === 'string' && waitFor.trim() !== '') {
        await page.waitForSelector(waitFor);
    }
}

async function getMetrics(page: Page) {
    return await page.metrics();
}

async function getPerformanceEntries(page: Page): Promise<PerformanceEntry[]> {
    const rawMetrics = await page.evaluate(() => JSON.stringify(performance.getEntries()));

    return JSON.parse(rawMetrics);
}

async function getObservablePerformanceEntries(page: Page): Promise<PerformanceEntry[]> {
    const rawMetrics = await page.evaluate(() => JSON.stringify((<IWithObserver>window)._cpo?.getEntries() ?? []));

    return JSON.parse(rawMetrics);
}

export async function dumpMetrics(page: Page) {
    const performanceEntries: ExtendedPerformanceEntry[] = await getPerformanceEntries(page);
    const obeservableEntries = await getObservablePerformanceEntries(page);
    const metrics = await getMetrics(page);

    const fcp = performanceEntries.find((x) => x.name === 'first-contentful-paint');
    debug(`fcp: ${fcp ? fcp.startTime : 'undefined'}`);

    return {
        metrics,
        performanceEntries: [...performanceEntries, ...obeservableEntries],
    };
}
