import puppeteer, { Browser, Page, CDPSession } from 'puppeteer';
import { debug, log } from './logger';
import { NetworkSetup } from './profiler/perf-options';
import { measureLCP, setupObserversStorage, IWithObserver, LARGEST_CONTENTFUL_PAINT } from './profiler/performance-observers';
import { Tracer, Trace, subsetTrace, extractResourceData, TraceEvent } from './profiler/trace';
import { ExtendedPerformanceEntry } from './profiler/types';
import { orderByAscending } from './utils/';

async function warmThePage(url: URL, pageInstance: Page) {
    debug('warming up page');
    await pageInstance.goto(url.href, { waitUntil: 'networkidle0' });
    debug('warming finished, closing page');
    await pageInstance.close();
}

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

async function extractPageMetrics(page: Page) {
    debug('extracting page metrics');
    return await page.metrics();
}

async function extractObservablePerformanceEntries(page: Page): Promise<PerformanceEntry[]> {
    debug('extracting observable performance entries');
    const rawMetrics = await page.evaluate(function serializeObservableEntries() {
        const data = (<IWithObserver>window)._cpo?.getEntries() ?? [];
        function safeSerializer() {
            const seen = new WeakSet();
            return function serializer(_: string, value: any) {
                if (typeof value === 'object' && value !== null) {
                    if (seen.has(value)) {
                        return;
                    }
                    seen.add(value);
                }
                return value;
            };
        }

        return JSON.stringify(data, safeSerializer());
    });

    return JSON.parse(rawMetrics);
}

async function extractPerformanceEntries(page: Page): Promise<PerformanceEntry[]> {
    const rawMetrics = await page.evaluate(() => JSON.stringify(performance.getEntries()));

    return JSON.parse(rawMetrics);
}

function normalizedPerformanceEntries(performanceEntries: ExtendedPerformanceEntry[]): ExtendedPerformanceEntry[] {
    const defaultEntries: ExtendedPerformanceEntry[] = [];
    const lcpEntries: ExtendedPerformanceEntry[] = [];

    performanceEntries.forEach((p) => {
        if (p.entryType === LARGEST_CONTENTFUL_PAINT) {
            lcpEntries.push(p);
            return;
        }

        defaultEntries.push(p);
    });

    const lastLcpEvent = orderByAscending(lcpEntries, (x) => x.renderTime ?? x.loadTime ?? 0)[0];

    const result = [...defaultEntries];

    if (lastLcpEvent) {
        result.push(lastLcpEvent);
    }

    return result;
}

function updateMissingData(entries: ExtendedPerformanceEntry[], { traceEvents }: { traceEvents: TraceEvent[] }): PerformanceEntry[] {
    const traceSubset = subsetTrace(traceEvents);

    entries.forEach((entry) => {
        if (entry.entryType !== 'resource') {
            return;
        }

        const { finish, receiveResponse } = extractResourceData(entry.name, traceSubset);

        const mimeType = receiveResponse?.args.data.mimeType ?? 'unknown';

        if (!entry.encodedBodySize) {
            entry.encodedBodySize = finish?.args.data.encodedDataLength ?? 0;
        }

        if (!entry.extension?.mimeType) {
            if (entry.extension) {
                entry.extension.mimeType = mimeType;
            } else {
                entry.extension = { mimeType };
            }
        }
    });

    return entries;
}

async function extractPerformanceMetrics(page: Page, trace: Trace) {
    const metrics = await extractPageMetrics(page);
    const observables = await extractObservablePerformanceEntries(page);
    const performanceEntries = await extractPerformanceEntries(page);

    const normalizedEntries = normalizedPerformanceEntries([...performanceEntries, ...observables]);
    const extendedEntries = updateMissingData(normalizedEntries, trace);

    const fcp = performanceEntries.find((x) => x.name === 'first-contentful-paint');
    debug(`fcp: ${fcp ? fcp.startTime : 'undefined'}`);

    return {
        metrics,
        performanceEntries: extendedEntries,
    };
}

type ProfileParams = {
    useCache: boolean;
    url: URL;
    throttlingRate: number;
    network: NetworkSetup;
    waitFor: number | string | undefined;
};

async function profilePage(browser: Browser, profileParams: ProfileParams, outputTracesTo: string) {
    const { useCache, url, throttlingRate, network, waitFor } = profileParams;
    await warmThePage(url, await browser.newPage());

    console.log(`is browser closed: ${browser.isConnected()}`);

    const newPage = await browser.newPage();

    console.log(`is page closed: ${newPage.isClosed()}`);

    const pageSession = await newPage.target().createCDPSession();

    await setupPerformanceObservers(newPage);
    await setupCachePolicy(!useCache, newPage, pageSession);
    await setupNetworkConditions(network, pageSession);
    await setupCpuConditions(throttlingRate, pageSession);
    await enablePerformance(pageSession);

    const tracer = new Tracer(outputTracesTo);
    await tracer.start(newPage);
    await runApplication(url, newPage, waitFor);
    const trace = await tracer.stop();

    const result = await extractPerformanceMetrics(newPage, trace);

    newPage.close();

    return result;
}

export async function* iterateAsync<TData, TRes>(sequence: TData[], asyncHandler: (arg: TData, i: number) => Promise<TRes>) {
    for (let index = 0; index < sequence.length; index++) {
        const element = sequence[index];
        yield await asyncHandler(element, index);
    }
}

type BrowserLaunchOptions = {
    headless: boolean;
    timeout: number;
    ignoreDefaultArgs: boolean;
    args: string[] | undefined;
    product: 'chrome';
    executablePath: string | undefined;
};

export async function runProfilingSession(
    browserLaunchOptions: BrowserLaunchOptions,
    profileOptions: ProfileParams,
    numberOfRuns: number,
    outputTracesTo: string
) {
    const { args, headless, timeout, ignoreDefaultArgs, product, executablePath } = browserLaunchOptions;

    debug(`running chrome with args: ${args && args.length ? args : `no args provided`}`);

    const browser = await puppeteer.launch({
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

    await browser.close();

    return perfromanceData;
}
