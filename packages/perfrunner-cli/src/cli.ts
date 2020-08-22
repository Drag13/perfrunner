#!/usr/bin/env node

import { profile, logger } from 'perfrunner-core';
import { ConsoleArguments } from './arguments';
import { mapArgs } from './mapper';
import { setupLogLevel } from './logging';
import { loadReporter } from './reporter';
import { ensureFolderCreated } from './utils';
import { iterateAsync, asyncToArray } from 'perfrunner-core/dist/utils/async';

import { getCommandFromArguments, GenerateConfigCommand, RunTestsCommand, ReadConfigCommand } from './commands/parser';
import { writeFileSync, readFileSync } from 'fs';

function generateConfigCommandHandler(_: GenerateConfigCommand) {
    writeFileSync('./perfrunner.json', JSON.stringify([]), { encoding: 'utf-8' });
    return 1;
}

async function runTests(args: ConsoleArguments) {
    setupLogLevel(args.logLevel);
    const { perfrunnerOptions, reporterOptions } = mapArgs(args);
    const asyncSequence = iterateAsync(perfrunnerOptions, (params, i) => {
        ensureFolderCreated(params.output);
        logger.debug(JSON.stringify(params.network));
        return profile({ ...params, purge: i === 0 ? params.purge : false });
    });

    const allResults = await asyncToArray(asyncSequence);

    logger.debug('loading reporter');

    const reporter = await loadReporter(reporterOptions.name);

    logger.log('generating report');

    const exitCode = await reporter(perfrunnerOptions[0].output, allResults[allResults.length - 1], reporterOptions.params);
    logger.log(exitCode === 0 ? `done` : `reporter exited with ${exitCode}`);
    return exitCode;
}

async function readConfigCommandHandler(cmd: ReadConfigCommand) {
    const { pathToConfig } = cmd.args;
    const rawArgs = readFileSync(pathToConfig, { encoding: 'utf-8' });
    const args = <ConsoleArguments>JSON.parse(rawArgs);
    return await runTests(args);
}

async function runTestsCommandHandler(cmd: RunTestsCommand) {
    const { args } = cmd;
    return await runTests(args);
}

(async function (): Promise<number> {
    try {
        const cmd = getCommandFromArguments();
        let exitCode = 0;

        if (cmd instanceof RunTestsCommand) {
            exitCode = await runTestsCommandHandler(cmd);
        }
        if (cmd instanceof ReadConfigCommand) {
            exitCode = await readConfigCommandHandler(cmd);
        }
        if (cmd instanceof GenerateConfigCommand) {
            exitCode = generateConfigCommandHandler(cmd);
        }

        return exitCode;
    } catch (error) {
        logger.error(error);
        return -1;
    }
})();
