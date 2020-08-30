import { TestParams } from '../params';
import { ICommand } from './icommand';
import { mapArgs } from './mapper';

import { runTest } from '../runner/run-test';
import { generateReport } from '../runner/generate-report';
import { iterateAsync, asyncToArray } from 'perfrunner-core/dist/utils/async';

export class RunTestsFromConsoleCommand implements ICommand<TestParams> {
    readonly name = '--from-console';
    readonly args: TestParams;

    constructor(args: TestParams) {
        this.args = args;
    }

    async execute() {
        const { perfrunnerOptions, reporterOptions } = mapArgs(this.args);

        const asyncSequence = iterateAsync(perfrunnerOptions, (arg, i) => runTest(arg, i));
        const result = (await asyncToArray(asyncSequence)).pop();

        return await generateReport(reporterOptions.name, perfrunnerOptions[0].output, result, reporterOptions.params);
    }
}
