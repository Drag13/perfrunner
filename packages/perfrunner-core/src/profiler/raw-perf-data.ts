import { Metrics } from 'puppeteer';

export type RawPerfData = {
    metrics: Metrics;
    performanceEntries: PerformanceEntry[]
}