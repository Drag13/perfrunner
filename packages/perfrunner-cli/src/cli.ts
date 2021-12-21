#!/usr/bin/env node

import { logger } from 'perfrunner-core';
import { getCommand } from './commands';
import { generateConfig, runTestsFromConsole, runTestFromConfig } from './commands';
import { DEFAULT_CONFIG_NAME, DEFAULT_FOLRDER_CONFIG } from './config';

(async function (): Promise<number> {
    try {
        const { cmd, logLevel } = getCommand();

        if (logLevel) {
            process.env.LOG_LEVEL = logLevel;
        }

        switch (cmd) {
            case 'create-config':
                return generateConfig(DEFAULT_CONFIG_NAME, DEFAULT_FOLRDER_CONFIG);
            case 'run-test-from-console':
                return await runTestsFromConsole();
            case 'run-test-from-config':
                return await runTestFromConfig(DEFAULT_CONFIG_NAME, DEFAULT_FOLRDER_CONFIG);
            default:
                throw 'Not implemented';
        }
    } catch (error: any) {
        logger.error(error);
        return -1;
    }
})();
