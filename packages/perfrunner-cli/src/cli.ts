#!/usr/bin/env node

import { profile, logger } from 'perfrunner-core';
import { parseConsole } from './arguments';
import { mapArgs } from './mapper';
import { setupLogLevel } from './logging';
import { loadReporter } from './reporter';
import { ensureFolderCreated } from './utils';
import { iterateAsync, asyncToArray } from 'perfrunner-core/dist/utils/async';

(async function (): Promise<number> {
    try {
        const args = parseConsole();

        setupLogLevel(args.logLevel);

        const { perfrunnerOptions, reporterOptions } = mapArgs(args);

        const asyncSequence = iterateAsync(perfrunnerOptions, (params, i) => {
            ensureFolderCreated(params.output);
            logger.debug(JSON.stringify(params.network));
            return profile({ ...params, purge: i === 0 ? params.purge : false });
        });

        const allResults = await asyncToArray(asyncSequence);

        logger.debug('loading reporter');

        const reporter = await loadReporter(reporterOptions.name);

        logger.log('generating report');

        const exitCode = await reporter(perfrunnerOptions[0].output, allResults[allResults.length - 1], reporterOptions.params);
        logger.log(exitCode === 0 ? `done` : `reporter exited with ${exitCode}`);

        return exitCode;
    } catch (error) {
        logger.error(error);
        return -1;
    }
})();
