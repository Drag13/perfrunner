import { ExtendedPerformanceEntry } from 'perfrunner-core';

type PathName = string;
type ResourceType = 'js' | 'img' | 'css' | 'xhr' | 'font' | 'document' | 'unknown' | 'html';

interface IIsResource {
    (pathName: PathName, mimeType?: string): boolean;
}

const isType = (formats: string[], mimeTypes: string[]): IIsResource => (pathName, mimeType?) =>
    formats.some((type) => pathName.endsWith(type)) || (!!mimeType && mimeTypes.includes(mimeType));

const cssFormats = ['.css'];
const cssMimeTypes = ['text/css'];
const isCss = isType(cssFormats, cssMimeTypes);

const jsMimeTypes = ['application/javascript', 'text/javascript', 'application/x-javascript'];
const jsFormats = ['.js'];
const isJs = isType(jsFormats, jsMimeTypes);

const imgFormats = ['.png', '.jpg', '.jpeg', '.tiff', '.webp', 'gif', 'svg'];
const imgMimeTypes = ['image/gif', 'image/png', 'image/jpeg']; // should be extended
const isImg = isType(imgFormats, imgMimeTypes);

const xhrFormats: string[] = [];
const xhrMimeType = ['application/json'];
const isXhr = isType(xhrFormats, xhrMimeType);

const fontFormats = ['.woff', '.woff2', '.ttf', '.otf'];
const fontMimeTypes: string[] = []; // should be extended
const isFont = isType(fontFormats, fontMimeTypes);

const htmlFormats = ['.html'];
const htmlMimeTypes = ['text/html'];
const isHtml = isType(htmlFormats, htmlMimeTypes);

const getPathName = (url: string): PathName => {
    try {
        const u = new URL(url);
        return u.pathname.toLowerCase();
    } catch (e) {
        console.warn(`invalid url: ${url}`, e);
        console.warn(e);
        return '';
    }
};

const getResourceType = (pEntry: ExtendedPerformanceEntry): ResourceType => {
    if (pEntry.entryType === 'navigation') {
        return 'document';
    }

    if (pEntry.entryType === 'resource') {
        const pathName = getPathName(pEntry.name);
        const mimeType = pEntry.extension?.mimeType;

        if (isJs(pathName, mimeType)) {
            return 'js';
        }

        if (isCss(pathName, mimeType)) {
            return 'css';
        }

        if (isImg(pathName, mimeType)) {
            return 'img';
        }

        if (isXhr(pathName, mimeType)) {
            return 'xhr';
        }

        if (isFont(pathName, mimeType)) {
            return 'font';
        }

        if (isHtml(pathName, mimeType)) {
            return 'html';
        }
    }

    console.log(`${pEntry.name} ${pEntry.entryType}, ${pEntry.extension}`);
    return 'unknown';
};

export { isCss, isJs, isImg, isXhr, isFont, ResourceType, getResourceType };
