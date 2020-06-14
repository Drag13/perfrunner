import { Metrics } from 'puppeteer';
import { ExtendedPerformanceEntry } from '../profiler/browser';

export type PerformanceData = {
    pageMetrics: Metrics;
    performanceEntries: Readonly<ExtendedPerformanceEntry>[];
}
