import { TestParams } from '../params/params';
import { ICommand } from './icommand';
import { mapArgs } from './mapper';

import { runTest } from '../runner/run-test';
import { generateReport } from '../runner/generate-report';
import { iterateAsync, asyncToArray } from 'perfrunner-core/dist/utils/async';
import { logger } from 'perfrunner-core';

export class RunTestsFromConsoleCommand implements ICommand {
    readonly name = '--from-console';

    constructor(private readonly args: TestParams) {}

    async execute() {
        const { perfrunnerOptions, reporterOptions } = mapArgs(this.args);

        const options = this.args.reportOnly ? perfrunnerOptions.slice(0, 1) : perfrunnerOptions;

        const asyncSequence = iterateAsync(options, (arg, i) => runTest(arg, i));
        const result = (await asyncToArray(asyncSequence)).pop();

        const outputTo = perfrunnerOptions[0].output;

        const exitCode = await generateReport(reporterOptions.name, perfrunnerOptions[0].output, result, reporterOptions.params);

        logger.log(`To view results, please check: ${outputTo}`);

        return exitCode;
    }
}
