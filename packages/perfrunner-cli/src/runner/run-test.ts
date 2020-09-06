import { profile, PerfRunnerOptions, logger } from 'perfrunner-core';
import { ensureFolderCreated } from '../utils';

export async function runTest(profilingOptions: PerfRunnerOptions, i: number) {
    ensureFolderCreated(profilingOptions.output);

    logger.debug(JSON.stringify(profilingOptions.network));

    return await profile({ ...profilingOptions, purge: i === 0 ? profilingOptions.purge : false });
}
