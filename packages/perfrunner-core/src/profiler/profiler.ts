import { Page } from 'puppeteer';
import { RawPerfData } from './raw-perf-data';
import { PerfRunnerOptions } from './perf-options';
import { log, debug as t } from '../utils/log';
import { subsetTrace, extractResourceData, TraceEvent, Tracer } from './trace';
import {
    ExtendedPerformanceEntry,
    startApplication,
    dumpMetrics,
    startBrowser,
    startEmptyPage,
    setupPerformanceConditions,
} from './browser';

async function* profilePage(emptyPage: Page, url: string, runs: number, waitFor: string | number | undefined, tracer: Tracer) {
    for (let i = 0; i < runs; i++) {
        log(`running #${i + 1} profile session`);

        t(`start tracing`);
        await tracer.start(emptyPage);

        t(`start application`);
        await startApplication(emptyPage, url, waitFor);

        t(`getting trace data`);
        const trace = await tracer.stop();

        t(`getting metrics`);
        const dump = await dumpMetrics(emptyPage);

        yield { ...dump, trace };
    }
}

function updateMissingData(entries: ExtendedPerformanceEntry[], { traceEvents }: { traceEvents: TraceEvent[] }): PerformanceEntry[] {
    const traceSubset = subsetTrace(traceEvents);

    entries.forEach((entry) => {
        if (entry.entryType !== 'resource') {
            return;
        }

        const { finish, receiveResponse } = extractResourceData(entry.name, traceSubset);

        const mimeType = receiveResponse?.args.data.mimeType ?? 'unknown';
        const encodedBodySize = finish?.args.data.encodedDataLength ?? 0;

        if (!entry.encodedBodySize) {
            entry.encodedBodySize = encodedBodySize;
        }

        if (entry.extension) {
            entry.extension.mimeType = mimeType;
        } else {
            entry.extension = { mimeType };
        }
    });

    return entries;
}

export async function profile(url: URL, options: PerfRunnerOptions): Promise<RawPerfData[]> {
    const { waitFor, runs } = options;
    const browser = await startBrowser(options.timeout, options.headless, options.ignoreDefaultArgs, options.chromeArgs);
    const result = [];

    try {
        const page = await startEmptyPage(browser);
        await setupPerformanceConditions(page, options);

        t('warming up the page');
        await startApplication(page, url.href, waitFor);

        const tracer = new Tracer(options.output);

        for await (const dump of profilePage(page, url.href, runs, waitFor, tracer)) {
            const performanceEntries = updateMissingData(dump.performanceEntries, dump.trace);
            result.push({ metrics: dump.metrics, performanceEntries });
        }

        await page.close();

        return result;
    } catch (e) {
        console.log(e);
        throw e;
    } finally {
        browser.close();
    }
}
