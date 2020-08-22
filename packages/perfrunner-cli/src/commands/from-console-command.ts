import { TestParams } from './test-params';
import { ICommand } from './icommand';

export class RunTestsFromConsoleCommand implements ICommand<TestParams> {
    readonly name = '--from-console';
    readonly args: TestParams;

    constructor(args: TestParams) {
        this.args = args;
    }
}
