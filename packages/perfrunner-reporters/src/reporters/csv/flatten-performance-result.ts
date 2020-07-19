import { Metrics, ExtendedPerformanceEntry } from 'perfrunner-core';

export interface FlattenPerformanceResult extends Partial<ExtendedPerformanceEntry>, Partial<Metrics> {
    id: number;
    name: string;
    comment?: string;
    downloadThroughput: number;
    uploadThroughput: number;
    latency: number;
    throttlingRate: number;
    url: string;
    useCache: boolean;
    timeStamp: number;
    mimeType?: string;
}
