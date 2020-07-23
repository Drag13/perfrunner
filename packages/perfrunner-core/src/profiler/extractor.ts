import { Trace, subsetTrace, TraceEvent, extractResourceData } from './trace';
import { Page } from 'puppeteer';
import { ExtendedPerformanceEntry } from './types';
import { LARGEST_CONTENTFUL_PAINT, IWithObserver } from './performance-observers';
import { debug } from '../logger';
import { orderByAscending } from '../utils';

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

export async function extractPerformanceMetrics(page: Page, trace: Trace) {
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
