import { Metrics } from 'puppeteer';
import { PerfOptions } from '../profiler/perf-options';
import { ExtendedPerformanceEntry } from '../profiler/types';

export interface PerfRunResult {
    timeStamp: number;
    runParams: PerfOptions;
    pageMetrics: Metrics;
    performanceEntries: ExtendedPerformanceEntry[];
    comment?: string;
}
