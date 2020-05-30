import { DEFAULT_HTTP_SCHEME } from '../config';

export const Url = (mayBeUrl: string | undefined): URL => {
    if (mayBeUrl == null || mayBeUrl === '') { throw new Error(`URL is required`) };

    const isSchemePresent = mayBeUrl.startsWith('https') || mayBeUrl.startsWith('http');
    return isSchemePresent ? new URL(mayBeUrl) : new URL(`${DEFAULT_HTTP_SCHEME}://${mayBeUrl}`);
}