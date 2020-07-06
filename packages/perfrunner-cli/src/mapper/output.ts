import { resolve } from 'path';

const generateFriendlyNameFromUrl = (url: URL): string => {
    const friendlyHost = url.host.replace(/[\.:]/g, '_'); // remove . and : from host
    const friendlyPath = url.pathname && url.pathname !== '/' ? `__${url.pathname.replace(/[\\]/g, '_')}` : ''; // remove /

    return `${friendlyHost}${friendlyPath}`;
};

const santizePath = (path: string) => path; // TODO: implement sanitaze

export function getOutputPath(rootOutputFolder: string, testName: string): string;
export function getOutputPath(rootOutputFolder: string, url: URL): string;
export function getOutputPath(rootOutputFolder: string, target: URL | string): string {
    const subfolder = typeof target === 'string' ? target : generateFriendlyNameFromUrl(target);
    const safePathToSubfolder = santizePath(subfolder);

    return resolve(process.cwd(), rootOutputFolder, safePathToSubfolder);
}
