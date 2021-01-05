import { PerfRunResult } from 'perfrunner-core';
import { FlattenPerformanceResult } from './flatten-performance-result';

export function metricsToCsv(testResult: PerfRunResult, id: number): FlattenPerformanceResult {
    return {
        ...testResult.pageMetrics,
        id,
        name: 'page-metric',
        comment: testResult.comment,
        downloadThroughput: testResult.runParams.network.downloadThroughput,
        latency: testResult.runParams.network.latency,
        uploadThroughput: testResult.runParams.network.uploadThroughput,
        throttlingRate: testResult.runParams.throttlingRate,
        url: testResult.runParams.url,
        useCache: !!testResult.runParams.useCache,
        timeStamp: testResult.timeStamp,
    };
}
