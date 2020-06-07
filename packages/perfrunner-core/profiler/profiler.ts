import { Page } from 'puppeteer';
import { RawPerfData } from './raw-perf-data';
import { PerfRunnerOptions } from './perf-options';
import { log, debug as t } from '../utils/log';
import { startTracing, stopTracing, subsetTrace, extractResourceData, TraceEvent } from "./trace";
import { ExtendedPerformanceEntry, startApplication, dumpMetrics, startBrowser, startEmptyPage, setupPerformanceConditions } from './browser';

async function* profilePage(emptyPage: Page, url: string, runs: number, waitFor: string | number | undefined) {
    for (let i = 0; i < runs; i++) {

        log(`running #${i + 1} profile session`);

        t(`start tracing`);
        await startTracing(emptyPage);

        t(`start application`);
        await startApplication(emptyPage, url, waitFor);

        t(`getting metrics`);
        const dump = await dumpMetrics(emptyPage);

        t(`getting trace data`);
        const trace = await stopTracing(emptyPage);

        yield { ...dump, trace };
    }
}

function updateMissingData(entries: ExtendedPerformanceEntry[], { traceEvents }: { traceEvents: TraceEvent[] }): PerformanceEntry[] {

    const traceSubset = subsetTrace(traceEvents);

    entries.forEach(entry => {

        if (entry.entryType !== 'resource') { return; }

        const { finish, receiveResponse } = extractResourceData(entry.name, traceSubset);

        const mimeType = receiveResponse?.args.data.mimeType ?? 'unknown';
        const encodedBodySize = finish?.args.data.encodedDataLength ?? 0;

        if (!entry.encodedBodySize) {
            entry.encodedBodySize = encodedBodySize;
        }

        if (entry.extension) {
            entry.extension.mimeType = mimeType;
        } else {
            entry.extension = { mimeType }
        }
    });

    return entries;
}

export async function profile(options: PerfRunnerOptions): Promise<RawPerfData[]> {
    const { useCache, url, waitFor, runs } = options;
    const browser = await startBrowser(options.timeout, options.headless, options.ignoreDefaultArgs ,options.chromeArgs);
    const result = [];

    try {

        const page = await startEmptyPage(browser);
        await setupPerformanceConditions(page, options);

        if (useCache) { // warm up application
            log(`warming up cache`)
            await startApplication(page, url.href, waitFor)
        }

        for await (const dump of profilePage(page, url.href, runs, waitFor)) {
            const performanceEntries = updateMissingData(dump.performanceEntries, dump.trace);
            result.push({ metrics: dump.metrics, performanceEntries })
        }

        await page.close();

        return result;
    }
    catch (e) { console.log(e); throw (e) }
    finally { browser.close(); }
}