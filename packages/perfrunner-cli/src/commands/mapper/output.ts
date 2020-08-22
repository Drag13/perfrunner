import { resolve } from 'path';

const generateFriendlyNameFromUrl = (url: URL): string => {
    const friendlyHost = url.host.replace(/[\.:]/g, '_'); // remove . and : from host
    const pathName = url.pathname;
    const normalizedPath = pathName.endsWith('/') ? pathName.substring(0, pathName.length - 1) : pathName;
    const friendlyPath = normalizedPath.replace(/[\\\/]/g, '__');

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
