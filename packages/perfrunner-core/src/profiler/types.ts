import { Metrics } from 'puppeteer';

/**
 * Performance entry with additional fields
 */
export interface ExtendedPerformanceEntry extends PerformanceEntry {
    initiatorType?: string;
    nextHopProtocol?: string;
    workerStart?: number;
    redirectStart?: number;
    redirectEnd?: number;
    fetchStart?: number;
    domainLookupStart?: number;
    domainLookupEnd?: number;
    connectStart?: number;
    connectEnd?: number;
    secureConnectionStart?: number;
    requestStart?: number;
    responseStart?: number;
    responseEnd?: number;
    transferSize?: number;
    encodedBodySize?: number;
    decodedBodySize?: number;
    serverTiming?: any[];
    workerTiming?: any[];
    unloadEventStart?: number;
    unloadEventEnd?: number;
    domInteractive?: number;
    domContentLoadedEventStart?: number;
    domContentLoadedEventEnd?: number;
    domComplete?: number;
    loadEventStart?: number;
    loadEventEnd?: number;
    type?: string;
    redirectCount?: number;
    renderTime?: number;
    loadTime?: number;
    extension?: {
        mimeType: string; // TODO: not all will have mime type, should be optional
    };
}

export type RawPerfData = {
    metrics: Metrics;
    performanceEntries: PerformanceEntry[];
};
