import { IPerformanceResult, PerfRunnerOptions } from 'perfrunner-core';
import { asyncToArray, iterateAsync } from 'perfrunner-core/dist/utils/async';
import { runSingleTest } from './run-single';

export async function runTestSeries(config: PerfRunnerOptions[]): Promise<IPerformanceResult> {
    const asyncResults = iterateAsync(config, runSingleTest);
    const results = await asyncToArray(asyncResults);

    const lastResult = results.pop();

    return lastResult;
}
