import { Metrics } from 'puppeteer';
import { ExtendedPerformanceEntry } from '../processor/perf-data';

export interface PerfRunResult {
    timeStamp: number;
    runParams: PerfOptions;
    pageMetrics: Metrics;
    performanceEntries: ExtendedPerformanceEntry[];
}

import { PerfOptions } from '../profiler/perf-options';

export type IPerformanceResult = PerfRunResult[];

export type DbSchema = {
    profile: PerfRunResult[],
    count: number
}