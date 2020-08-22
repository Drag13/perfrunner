#!/usr/bin/env node

import { logger } from 'perfrunner-core';

import { createCommand } from './commands';
import { parseConsole } from './console/console-arguments-parser';
import { setupLogLevel } from './logger';

(async function (): Promise<number> {
    try {
        const userInput = parseConsole();

        setupLogLevel(userInput.logLevel);

        const commandName = userInput._unknown == null ? '--from-console' : userInput._unknown[0];
        const cmd = createCommand(commandName, userInput);

        return await cmd.execute();
    } catch (error) {
        logger.error(error);
        return -1;
    }
})();
