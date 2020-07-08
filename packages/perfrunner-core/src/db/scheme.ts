import { Metrics } from 'puppeteer';

export interface PerfRunResult {
    timeStamp: number;
    runParams: PerfOptions;
    pageMetrics: Metrics;
    performanceEntries: ExtendedPerformanceEntry[];
    comment?: string;
}

import { PerfOptions } from '../profiler/perf-options';
import { ExtendedPerformanceEntry } from '../profiler/types';

/**
 * List of the all perfromance runs for the given URL or testName
 */
export type IPerformanceResult = PerfRunResult[];

export type DbSchema = {
    profile: PerfRunResult[];
    count: number;
};
