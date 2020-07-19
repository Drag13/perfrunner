import { ExtendedPerformanceEntry } from 'perfrunner-core';
import { PerfRunResult } from 'perfrunner-core/dist/db/scheme';
import { FlattenPerformanceResult } from './flatten-performance-result';
import { exclude } from '../../utils';

function mapPerfEntry(pe: ExtendedPerformanceEntry, testResult: PerfRunResult, id: number): FlattenPerformanceResult {
    return {
        id,
        comment: testResult.comment,
        downloadThroughput: testResult.runParams.network.downloadThroughput,
        latency: testResult.runParams.network.latency,
        uploadThroughput: testResult.runParams.network.uploadThroughput,
        throttlingRate: testResult.runParams.throttlingRate,
        url: testResult.runParams.url,
        useCache: !!testResult.runParams.useCache,
        timeStamp: testResult.timeStamp,
        mimeType: pe.extension?.mimeType,
        ...exclude(pe, ['extension', 'element']),
    };
}

export const perfEntriesToCsv = (testResult: PerfRunResult) =>
    testResult.performanceEntries.map((pe, id) => mapPerfEntry(pe, testResult, id));
