#!/usr/bin/env node

import { profile, logger } from 'perfrunner-core';
import { mapArgs } from './mapper';
import { setupLogLevel } from './logging';
import { loadReporter } from './reporter';
import { ensureFolderCreated } from './utils';
import { iterateAsync, asyncToArray } from 'perfrunner-core/dist/utils/async';

import { InitConfigCommand, createCommand, RunTestsFromConsoleCommand, RunTestsFromConfigCommand } from './commands';
import { writeFileSync, readFileSync } from 'fs';
import { TestParams } from './commands/test-params';
import { parseConsole } from './console/console-arguments-parser';

function generateConfigCommandHandler({ args: { pathToConfig } }: InitConfigCommand) {
    writeFileSync(pathToConfig, JSON.stringify([]), { encoding: 'utf-8' });
    return 1;
}

async function runTests(args: TestParams) {
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

async function readConfigCommandHandler(cmd: RunTestsFromConfigCommand) {
    const { pathToConfig } = cmd.args;
    const rawArgs = readFileSync(pathToConfig, { encoding: 'utf-8' });
    const args = <TestParams>JSON.parse(rawArgs);
    return await runTests(args);
}

async function runTestsCommandHandler(cmd: RunTestsFromConsoleCommand) {
    const { args } = cmd;
    return await runTests(args);
}

(async function (): Promise<number> {
    try {
        const userInput = parseConsole();
        const commandName = userInput._unknown == null ? '--from-console' : userInput._unknown[0];
        const cmd = createCommand(commandName, userInput);

        let exitCode = 0;

        if (cmd instanceof RunTestsFromConsoleCommand) {
            exitCode = await runTestsCommandHandler(cmd);
        }
        if (cmd instanceof RunTestsFromConfigCommand) {
            exitCode = await readConfigCommandHandler(cmd);
        }
        if (cmd instanceof InitConfigCommand) {
            exitCode = generateConfigCommandHandler(cmd);
        }

        return exitCode;
    } catch (error) {
        logger.error(error);
        return -1;
    }
})();
