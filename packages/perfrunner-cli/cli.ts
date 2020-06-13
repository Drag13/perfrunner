#!/usr/bin/env node

import cmd from "command-line-args";
import { params, CliParams } from "./options/options";
import { resolve } from "path";
import { profile } from "perfrunner-core";
import { loader } from "./utils/reporter-loader";
import { existsSync, mkdirSync } from 'fs';

const HTTP_SCHEME = 'http://';
const HTTPS_SCHEME = 'https://';
const DEFAULT_HTTP_SCHEME = HTTP_SCHEME;

const normalizeUrl = (url: string | undefined): string => {
    if (!url) { throw new Error(`Url is required, got undefined`); }
    const loweredUrl = url.toLowerCase();
    const isHttpSchemeSet = loweredUrl.startsWith(HTTP_SCHEME) || loweredUrl.startsWith(HTTPS_SCHEME);

    return isHttpSchemeSet ? url : `${DEFAULT_HTTP_SCHEME}url`
}

const generateFriendlyNameFromUrl = (url: URL): string => {
    const friendlyHost = url.host.replace(/[\.:]/g, '_'); // remove . and : from host
    const friendlyPath = url.pathname && url.pathname !== '/' ? `__${url.pathname.replace(/[\\]/g, '_')}` : ''; // remove /

    return `${friendlyHost}${friendlyPath}`;
}

const ensureFolderCreated = (pathToFolder: string) => {
    if (!existsSync(pathToFolder)) {
        mkdirSync(pathToFolder, { recursive: true });
    }
}

(async function (): Promise<number> {

    const inputParams = cmd(params, { camelCase: true }) as CliParams;

    const urlString = normalizeUrl(inputParams.url);
    const url = new URL(urlString);
    const endFolderName = generateFriendlyNameFromUrl(url);

    const outputFolder = resolve(process.cwd(), inputParams.output, endFolderName);

    ensureFolderCreated(outputFolder);

    try {

        const performanceResult = await profile({
            ...inputParams,
            useCache: inputParams.cache,
            throttlingRate: inputParams.throttling,
            headless: !inputParams.noHeadless,
            output: outputFolder
        });

        const report = await loader(inputParams.reporter);
        await report(outputFolder, performanceResult);
    }
    catch (error) {
        console.log(`\x1b[31m${error}\x1b[0m`);
        return -1;
    }

    return 0;
})();
