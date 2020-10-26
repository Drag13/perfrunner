import { argsLike } from '../../../utils';
import { logger } from 'perfrunner-core';
import { Original, Slow3g, HSPA, HSPA_Plus, FourG } from '../../../params/network';

export const ArgsLikeString = (v: string | undefined) => (v ? `--${argsLike(v)}` : '');

export const Bool = (v: string | undefined) => (v && v.toLowerCase() === 'true' ? true : false);

export const StringOrNumber = (v: string | undefined) => (v != null ? (parseInt(v).toString() === v ? parseInt(v) : v) : '');

export const LogLevel = (maybeLogLevel: string | undefined) => {
    if (!maybeLogLevel) {
        return undefined;
    }

    const logLevelKey = maybeLogLevel.toUpperCase();
    const logLevel = (logger.LOG_LEVEL as any)[logLevelKey];

    if (logLevel) {
        return logLevel;
    }

    throw new Error(`Unknown log level, known values are: ${Object.keys(logger.LOG_LEVEL).join(', ').toLowerCase()} `);
};

export const Network = (networkType: string | undefined) => {
    switch (networkType) {
        case 'online':
        case 'original':
            return Original;
        case 'slow-3g':
        case 'slow3g':
            return Slow3g;
        case 'hspa':
            return HSPA;
        case 'fast3g':
        case 'fast-3g':
        case 'hspaplus':
            return HSPA_Plus;
        case 'regular4g':
        case 'regular-4g':
            return FourG;
        default:
            throw new Error(`Unknow network setup: ${networkType}`);
    }
};
