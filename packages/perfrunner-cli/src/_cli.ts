#!/usr/bin/env node

import { logger } from 'perfrunner-core';
import { parseUserInput, commandFactory } from './console/parser';
import { setupLogLevel } from './logger';

(async function (): Promise<number> {
    try {
        const inputParams = parseUserInput();
        setupLogLevel(inputParams.logLevel);
        const cmd = commandFactory(inputParams);
        return await cmd.execute();
    } catch (error) {
        logger.error(error);
        return -1;
    }
})();
