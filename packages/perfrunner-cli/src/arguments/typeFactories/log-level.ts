import { logger } from 'perfrunner-core';

export const LogLevel = (maybeLogLevel: string | undefined) => {
    if (!maybeLogLevel) {
        return undefined;
    }

    const logLevelKey = maybeLogLevel.toUpperCase();
    const logLevel = (logger.LOG_LEVEL as any)[logLevelKey];

    if (logLevel) {
        return logLevel;
    }

    throw new Error('Unknown log level');
};
