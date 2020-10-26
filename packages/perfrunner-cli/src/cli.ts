#!/usr/bin/env node

import { logger } from 'perfrunner-core';
import { getBasicArguments } from './arguments';
import { runTestsFromConsole } from './commands/run-from-console/run-test-from-console';
import { generateConfig } from './commands/genereate-config/generate-config';

(async function (): Promise<number> {
    try {
        const cmdName = getBasicArguments();

        switch (cmdName) {
            case 'run-test-from-console':
                return await runTestsFromConsole();
            case 'init':
                return generateConfig();
            default:
                throw 'Not implemented';
        }
    } catch (error) {
        logger.error(error);
        return -1;
    }
})();
