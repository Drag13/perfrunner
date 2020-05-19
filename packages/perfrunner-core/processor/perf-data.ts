import { Metrics } from 'puppeteer';

export interface ExtendedPerformanceEntry extends PerformanceEntry {
    readonly initiatorType?: string;
    readonly nextHopProtocol?: string;
    readonly workerStart?: number;
    readonly redirectStart?: number;
    readonly redirectEnd?: number;
    readonly fetchStart?: number;
    readonly domainLookupStart?: number;
    readonly domainLookupEnd?: number;
    readonly connectStart?: number;
    readonly connectEnd?: number;
    readonly secureConnectionStart?: number;
    readonly requestStart?: number;
    readonly responseStart?: number;
    readonly responseEnd?: number;
    readonly transferSize?: number;
    readonly encodedBodySize?: number;
    readonly decodedBodySize?: number;
    readonly serverTiming?: any[];
    readonly workerTiming?: any[];
    readonly unloadEventStart?: number;
    readonly unloadEventEnd?: number;
    readonly domInteractive?: number;
    readonly domContentLoadedEventStart?: number;
    readonly domContentLoadedEventEnd?: number;
    readonly domComplete?: number;
    readonly loadEventStart?: number;
    readonly loadEventEnd?: number;
    readonly type?: string;
    readonly redirectCount?: number;
}

export type PerformanceData = {
    pageMetrics: Metrics;
    performanceEntries: ExtendedPerformanceEntry[];
}
