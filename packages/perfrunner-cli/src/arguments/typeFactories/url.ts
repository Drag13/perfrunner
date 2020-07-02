const HTTP_SCHEME = 'http://';
const HTTPS_SCHEME = 'https://';
const DEFAULT_HTTP_SCHEME = HTTP_SCHEME;

const normalizeUrl = (url: string): string => {
    const loweredUrl = url.toLowerCase();
    const isHttpSchemeSet = loweredUrl.startsWith(HTTP_SCHEME) || loweredUrl.startsWith(HTTPS_SCHEME);

    return isHttpSchemeSet ? url : `${DEFAULT_HTTP_SCHEME}${url}`;
};

export const Url = (v: string | undefined): URL => {
    if (v == null || v.trim() === '') {
        throw new Error(`Not empty URL should be provided`);
    }

    const urlString = normalizeUrl(v);

    return new URL(urlString);
};
