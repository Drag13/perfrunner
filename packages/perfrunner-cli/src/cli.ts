#!/usr/bin/env node

import cmd from 'command-line-args';
import { resolve } from 'path';
import { profile } from 'perfrunner-core';
import { logger } from 'perfrunner-core';

import { params, CliParams } from './options/options';
import { loader } from './utils/reporter-loader';
import { generateFriendlyNameFromUrl, normalizeUrl, ensureFolderCreated } from './utils';
(async function (): Promise<number> {
    try {
        const inputParams = cmd(params, { camelCase: true }) as CliParams;

        inputParams.logLevel && (process.env.LOG_LEVEL = inputParams.logLevel);

        const urlString = normalizeUrl(inputParams.url);
        const url = new URL(urlString);
        const endFolderName = generateFriendlyNameFromUrl(url);

        const outputFolder = resolve(process.cwd(), inputParams.output, endFolderName);

        ensureFolderCreated(outputFolder);

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

        logger.log('generating report');
        await report(outputFolder, performanceResult, reporterArgs);
    } catch (error) {
        logger.error(error);
        return -1;
    }

    return 0;
})();
