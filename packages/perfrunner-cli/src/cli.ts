#!/usr/bin/env node

import { profile, logger, PerfRunnerOptions, IPerformanceResult } from 'perfrunner-core';
import { parseConsole } from './arguments';
import { mapArgs } from './mapper';
import { setupLogLevel } from './logging';
import { ensureFolderCreated } from './fs';
import { loadReporter } from './reporter';

async function* runProfileSession(pf: PerfRunnerOptions[]) {
    for (let i = 0; i < pf.length; i++) {
        const params = pf[i];
        ensureFolderCreated(params.output);
        logger.debug(JSON.stringify(params.network));

        yield await profile({ ...params, purge: i === 0 ? params.purge : false });
    }
}

(async function (): Promise<number> {
    try {
        const args = parseConsole();

        setupLogLevel(args.logLevel);

        const { perfrunnerOptions, reporterOptions } = mapArgs(args);

        let performanceData: IPerformanceResult | undefined = undefined;
        for await (performanceData of runProfileSession(perfrunnerOptions)) {
        }

        logger.debug('loading reporter');

        const reporter = await loadReporter(reporterOptions.name);

        logger.log('generating report');

        await reporter(perfrunnerOptions[0].output, performanceData!, reporterOptions.params);
    } catch (error) {
        logger.error(error);
        return -1;
    }

    return 0;
})();
