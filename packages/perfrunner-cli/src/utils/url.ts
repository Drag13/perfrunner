const HTTP_SCHEME = 'http://';
const HTTPS_SCHEME = 'https://';
const DEFAULT_HTTP_SCHEME = HTTP_SCHEME;

export const normalizeUrl = (url: string | undefined): string => {
    if (!url) {
        throw new Error(`Url is required, got undefined`);
    }
    const loweredUrl = url.toLowerCase();
    const isHttpSchemeSet = loweredUrl.startsWith(HTTP_SCHEME) || loweredUrl.startsWith(HTTPS_SCHEME);

    return isHttpSchemeSet ? url : `${DEFAULT_HTTP_SCHEME}${url}`;
};

export const generateFriendlyNameFromUrl = (url: URL): string => {
    const friendlyHost = url.host.replace(/[\.:]/g, '_'); // remove . and : from host
    const friendlyPath = url.pathname && url.pathname !== '/' ? `__${url.pathname.replace(/[\\]/g, '_')}` : ''; // remove /

    return `${friendlyHost}${friendlyPath}`;
};
