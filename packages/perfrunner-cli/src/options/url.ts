import { normalizeUrl } from '../utils/url';

export const Url = (v: string | undefined): URL => {
    if (v == null || v.trim() === '') {
        throw new Error(`Not empty URL should be provided`);
    }

    const urlString = normalizeUrl(v);
    return new URL(urlString);
};
