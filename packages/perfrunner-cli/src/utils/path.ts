import { resolve } from 'path';

const generateFriendlyNameFromUrl = (url: URL): string => {
    const friendlyHost = url.host.replace(/[\.:]/g, '_'); // remove . and : from host
    const pathName = url.pathname;
    const normalizedPath = pathName.endsWith('/') ? pathName.substring(0, pathName.length - 1) : pathName;
    const friendlyPath = normalizedPath.replace(/[\\\/]/g, '__');

    return `${friendlyHost}${friendlyPath}`;
};

const santizePath = (path: string) => path; // TODO: implement sanitaze

export function getOutputPathFromtestName(outputFolder: string, testName: string) {
    const safePathToSubfolder = santizePath(testName);
    return resolve(process.cwd(), outputFolder, safePathToSubfolder);
}
export function getOutputPathFromUrl(outputFolder: string, url: string) {
    const subfolder = generateFriendlyNameFromUrl(new URL(url));
    const safePathToSubfolder = santizePath(subfolder);
    const result = resolve(process.cwd(), outputFolder, safePathToSubfolder);

    return result;
}
