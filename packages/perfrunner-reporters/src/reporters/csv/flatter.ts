import { IPerformanceResult } from 'perfrunner-core';
import { perfEntriesToCsv } from './perf-entry-mapper';
import { metricsToCsv } from './metrics-mapper';
import { FlattenPerformanceResult } from './flatten-performance-result';

function flatten(rawData: IPerformanceResult[]) {
    const result: FlattenPerformanceResult[] = [];

    return rawData.reduce((acc, testResult, id) => {
        const entries = perfEntriesToCsv(testResult);
        const metrics = metricsToCsv(testResult, id);

        return acc.concat(entries, metrics);
    }, result);
}

export { flatten };
