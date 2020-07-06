#!/usr/bin/env node

import { profile, logger } from 'perfrunner-core';
import { parseConsole } from './arguments';
import { mapArgs } from './mapper';
import { setupLogLevel } from './logging';
import { ensureFolderCreated } from './fs';
import { loadReporter } from './reporter';

(async function (): Promise<number> {
    try {
        const args = parseConsole();
        const { perfrunnerOptions, reporterOptions } = mapArgs(args);;

        setupLogLevel(args.logLevel);
        ensureFolderCreated(perfrunnerOptions.output);

        const performanceData = await profile(perfrunnerOptions);

        logger.debug('loading reporter');

        const reporter = await loadReporter(reporterOptions.name);

        logger.log('generating report');

        await reporter(perfrunnerOptions.output, performanceData, reporterOptions.params);
    } catch (error) {
        logger.error(error);
        return -1;
    }

    return 0;
})();
