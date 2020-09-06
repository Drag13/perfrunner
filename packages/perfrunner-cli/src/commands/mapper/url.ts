import { URL_IS_EMPTY } from '../../errors';
import { HTTP_SCHEME, HTTPS_SCHEME, DEFAULT_HTTP_SCHEME } from '../../config';

const normalizeUrl = (url: string): string => {
    const loweredUrl = url.toLowerCase();
    const isHttpSchemeSet = loweredUrl.startsWith(HTTP_SCHEME) || loweredUrl.startsWith(HTTPS_SCHEME);

    return isHttpSchemeSet ? url : `${DEFAULT_HTTP_SCHEME}${url}`;
};

export const Url = (v: string | undefined): URL => {
    if (v == null || v.trim() === '') {
        throw URL_IS_EMPTY;
    }

    const urlString = normalizeUrl(v);

    return new URL(urlString);
};
