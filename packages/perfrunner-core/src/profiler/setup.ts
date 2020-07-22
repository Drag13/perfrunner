import { Page, CDPSession } from 'puppeteer';
import { debug } from '../logger';
import { NetworkSetup } from './perf-options';
import { measureLCP, setupObserversStorage } from './performance-observers';

async function setupNetworkConditions(network: NetworkSetup, pageSession: CDPSession) {
    debug('setting network conditions');
    await pageSession.send('Network.enable');
    await pageSession.send('Network.emulateNetworkConditions', { ...network, offline: false }); // https://chromedevtools.github.io/devtools-protocol/tot/Network/#method-emulateNetworkConditions
}

async function setupCpuConditions(throttlingRate: number, pageSession: CDPSession) {
    debug(`setting CPU throttlingRate to ${throttlingRate}X`);
    await pageSession.send('Emulation.setCPUThrottlingRate', { rate: throttlingRate });
}

async function setupPerformanceObservers(page: Page) {
    debug('setting performanceObservers');
    await page.evaluateOnNewDocument(setupObserversStorage);
    await page.evaluateOnNewDocument(measureLCP);
}

async function setupCachePolicy(noCache: boolean, page: Page, pageSession: CDPSession) {
    if (noCache) {
        debug('setting cache policy...');
        await page.setCacheEnabled(false);
        await pageSession.send('Network.setCacheDisabled', { cacheDisabled: true });
    }
}

async function enablePerformance(pageSession: CDPSession) {
    debug('enabling performance measures');
    await pageSession.send('Performance.enable');
}

export async function setpPerformanceConditions(
    page: Page,
    { network, throttlingRate, useCache }: { useCache: boolean; network: NetworkSetup; throttlingRate: number }
) {
    const pageSession = await page.target().createCDPSession();
    await setupPerformanceObservers(page);
    await setupCachePolicy(!useCache, page, pageSession);
    await setupNetworkConditions(network, pageSession);
    await setupCpuConditions(throttlingRate, pageSession);
    await enablePerformance(pageSession);
}
