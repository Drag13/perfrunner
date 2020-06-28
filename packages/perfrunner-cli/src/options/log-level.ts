import { logger } from 'perfrunner-core';

export const LogLevel = (maybeLogLevel: string | undefined) => {
    if (!maybeLogLevel) {
        return undefined;
    }

    const logLevel = Object.values(logger.LOG_LEVEL).find((value) => value.toLowerCase() === maybeLogLevel.toLowerCase());

    if (logLevel) {
        return logLevel;
    }

    throw new Error('Unknown log level');
};
