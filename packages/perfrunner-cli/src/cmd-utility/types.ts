import { logger } from 'perfrunner-core';
import { DEFAULT_HTTP_SCHEME, FourG, HSPA, HSPA_Plus, HTTPS_SCHEME, HTTP_SCHEME, Original, Slow3g } from '../config';
import { URL_IS_EMPTY } from '../errors';
import { argsLike } from '../utils';

export const LogLevel = (maybeLogLevel: string | undefined): string | undefined => {
    if (!maybeLogLevel) {
        return undefined;
    }

    return maybeLogLevel.toLowerCase().trim() === 'verbose' ? logger.LOG_LEVEL.VERBOSE : undefined;
};

export const ArgsLikeString = (v: string | undefined) => (v ? `--${argsLike(v)}` : '');

export const Bool = (v: string | undefined) => (v && v.toLowerCase() === 'true' ? true : false);

export const StringOrNumber = (v: string | undefined) => (v != null ? (parseInt(v).toString() === v ? parseInt(v) : v) : '');

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

const normalizeUrl = (url: string): string => {
    const loweredUrl = url.toLowerCase();
    const isHttpSchemeSet = loweredUrl.startsWith(HTTP_SCHEME) || loweredUrl.startsWith(HTTPS_SCHEME);

    return isHttpSchemeSet ? url : `${DEFAULT_HTTP_SCHEME}${url}`;
};

export const Url = (v: string | undefined): URL => {
    if (v == null || v.trim() === '') {
        throw new Error(URL_IS_EMPTY);
    }

    const urlString = normalizeUrl(v);

    return new URL(urlString);
};

export const UrlBasedString = (v: string | undefined) => Url(v).href;
