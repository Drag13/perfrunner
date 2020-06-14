#!/usr/bin/env node

import cmd from 'command-line-args';
import { resolve } from 'path';
import { profile } from 'perfrunner-core';

import { params, CliParams } from './options/options';
import { loader } from './utils/reporter-loader';
import { generateFriendlyNameFromUrl, normalizeUrl, ensureFolderCreated } from './utils';
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
            url: url.href,
            useCache: inputParams.cache,
            throttlingRate: inputParams.throttling,
            headless: !inputParams.noHeadless,
            output: outputFolder,
        });

        const reporterName = inputParams.reporter[0];
        const reporterArgs = inputParams.reporter.slice(1, inputParams.reporter.length);

        const report = await loader(reporterName);
        await report(outputFolder, performanceResult, reporterArgs);
    } catch (error) {
        console.log(`\x1b[31m${error}\x1b[0m`);
        return -1;
    }

    return 0;
})();
