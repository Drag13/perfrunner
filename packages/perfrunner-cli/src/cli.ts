#!/usr/bin/env node

import { logger } from 'perfrunner-core';
import { parseUserInput, getCommandName } from './console/parser';
import { setupLogLevel } from './logger';
import { getCommandFromUserInput } from './commands';

(async function (): Promise<number> {
    try {
        const inputParams = parseUserInput();
        setupLogLevel(inputParams.logLevel);
        const commandName = getCommandName(inputParams);
        const cmd = getCommandFromUserInput(commandName, inputParams);
        return await cmd.execute();
    } catch (error) {
        logger.error(error);
        return -1;
    }
})();
