import { Page } from 'puppeteer';
import { RawPerfData, ExtendedPerformanceEntry } from './types';
import { PerfRunnerOptions } from './perf-options';
import { log, debug as t, error } from '../logger';
import { orderByAscending } from '../utils';
import { subsetTrace, extractResourceData, TraceEvent, Tracer } from './trace';
import {
    startApplication,
    dumpMetrics,
    startBrowser,
    startEmptyPage,
    setupPerformanceConditions,
    setupPerformanceObservers,
} from './browser';
import { LARGEST_CONTENTFUL_PAINT } from './performance-observers';

async function* profilePage(emptyPage: Page, url: string, runs: number, waitFor: string | number | undefined, tracer: Tracer) {
    for (let i = 0; i < runs; i++) {
        log(`running #${i + 1} profile session`);

        t(`start tracing`);
        await tracer.start(emptyPage);

        const started = Date.now();
        t(`start application`);
        await startApplication(emptyPage, url, waitFor);
        t(`page loaded for ${new Date(started - Date.now()).getMilliseconds()}ms`);

        t(`getting trace data`);
        const trace = await tracer.stop();

        t(`getting metrics`);
        const dump = await dumpMetrics(emptyPage);

        yield { ...dump, trace };
    }
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

export async function profile(url: URL, options: PerfRunnerOptions): Promise<RawPerfData[]> {
    const { waitFor, runs } = options;
    const { timeout, headless, ignoreDefaultArgs, chromeArgs, executablePath } = options;

    const browser = await startBrowser({
        args: chromeArgs,
        timeout,
        headless,
        ignoreDefaultArgs,
        product: 'chrome',
        executablePath,
    });

    const result = [];

    try {
        const page = await startEmptyPage(browser);
        page.setDefaultNavigationTimeout(options.timeout);
        await setupPerformanceObservers(page);
        await setupPerformanceConditions(page, options);

        const tracer = new Tracer(options.output);

        t('warming up the page');
        await startApplication(page, url.href, waitFor);

        for await (const dump of profilePage(page, url.href, runs, waitFor, tracer)) {
            const normalizedEntries = normalizedPerformanceEntries(dump.performanceEntries);
            const extendedEntries = updateMissingData(normalizedEntries, dump.trace);
            result.push({ metrics: dump.metrics, performanceEntries: extendedEntries });
        }

        await page.close();

        return result;
    } catch (e) {
        error(e);
        throw e;
    } finally {
        browser.close();
    }
}
