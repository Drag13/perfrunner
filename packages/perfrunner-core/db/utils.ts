import { existsSync, mkdirSync } from "fs";
import { dirname, resolve } from 'path';

const hex = (x: number) => x.toString(16);

function hash(text: string) {
    let hash = 0;
    let chr: number;

    for (let i = 0; i < text.length; i++) {
        chr = text.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0;
    }

    return hash;
}

type ImportantParams = { downloadThroughput: number, uploadThroughput: number, latency: number, throttlingRate: number, useCache?: boolean };

export function generateReportName(url: URL, { downloadThroughput, uploadThroughput, latency, throttlingRate, useCache }: ImportantParams): string {
    const meaningfulUrl = `${url.protocol}//${url.host}${url.pathname.endsWith('/') ? url.pathname : url.pathname + '/'}`;
    const hashedUrl = hash(meaningfulUrl);
    const fileName = `${hex(hashedUrl)}_${hex(downloadThroughput)}_${hex(uploadThroughput)}_${hex(latency)}_${throttlingRate}_${useCache ? 1 : 0}`;

    return fileName;
}

const getRootPath = () => dirname(require.main?.filename || '');

export const createFolderIfNotExists = (path: string): void => {
    const root = getRootPath();
    const pathToFolder = resolve(root, path);

    if (!existsSync(pathToFolder)) {
        mkdirSync(pathToFolder, { recursive: true });
    }
}