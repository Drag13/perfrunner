import puppeteer, { Page, Browser } from 'puppeteer';
import { PerfOptions } from './perf-options';
import { debug } from '../utils/log';

export interface ExtendedPerformanceEntry extends PerformanceEntry {
    initiatorType?: string;
    nextHopProtocol?: string;
    workerStart?: number;
    redirectStart?: number;
    redirectEnd?: number;
    fetchStart?: number;
    domainLookupStart?: number;
    domainLookupEnd?: number;
    connectStart?: number;
    connectEnd?: number;
    secureConnectionStart?: number;
    requestStart?: number;
    responseStart?: number;
    responseEnd?: number;
    transferSize?: number;
    encodedBodySize?: number;
    decodedBodySize?: number;
    serverTiming?: any[];
    workerTiming?: any[];
    unloadEventStart?: number;
    unloadEventEnd?: number;
    domInteractive?: number;
    domContentLoadedEventStart?: number;
    domContentLoadedEventEnd?: number;
    domComplete?: number;
    loadEventStart?: number;
    loadEventEnd?: number;
    type?: string;
    redirectCount?: number;
    extension?: {
        mimeType: string;
    };
}

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

export async function startApplication(page: Page, url: string, waitFor?: string | number) {
    await page.goto(url, { waitUntil: 'networkidle2' });
    if (typeof waitFor === 'number' && waitFor != 0 && !isNaN(waitFor)) {
        await page.waitFor(waitFor);
    }
    if (typeof waitFor === 'string' && waitFor.trim() !== '') {
        await page.waitForSelector(waitFor);
    }
}

export async function dumpMetrics(page: Page) {
    const performanceEntries: ExtendedPerformanceEntry[] = JSON.parse(
        await page.evaluate(() => JSON.stringify(performance.getEntries()))
    );
    const metrics = await page.metrics();

    const fcp = performanceEntries.find((x) => x.name === 'first-contentful-paint');
    debug(`fcp: ${fcp ? fcp.startTime : 'undefined'}`);

    return {
        metrics,
        performanceEntries,
    };
}
