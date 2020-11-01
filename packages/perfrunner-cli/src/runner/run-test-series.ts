import { profile, PerfRunnerOptions, logger, IPerformanceResult } from 'perfrunner-core';
import { asyncToArray, iterateAsync } from 'perfrunner-core/dist/utils/async';
import { ensureFolderCreated } from '../utils';

async function runSingleTest(profilingOptions: PerfRunnerOptions, i: number) {
    ensureFolderCreated(profilingOptions.output);

    logger.debug(JSON.stringify(profilingOptions.network));

    return await profile({ ...profilingOptions, purge: i === 0 ? profilingOptions.purge : false });
}

export async function runTestSeries(config: PerfRunnerOptions[]): Promise<IPerformanceResult> {
    const asyncResults = iterateAsync(config, runSingleTest);
    const results = await asyncToArray(asyncResults);

    const lastResult = results.pop();

    return lastResult;
}
