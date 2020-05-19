import { Metrics } from 'puppeteer';
import { PerfOptions } from '../profiler/perf-options';
import { ExtendedPerformanceEntry } from '../processor/perf-data';

export interface PerfRunResult {
    timeStamp: number;
    runParams: PerfOptions;
    pageMetrics: Metrics;
    performanceEntries: ExtendedPerformanceEntry[];
}

export type IPerformanceResult = PerfRunResult[] | undefined;