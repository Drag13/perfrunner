import { Metrics } from 'puppeteer';
import { ExtendedPerformanceEntry } from '../profiler/types';

export type PerformanceData = {
    pageMetrics: Metrics;
    performanceEntries: Readonly<ExtendedPerformanceEntry>[];
};
