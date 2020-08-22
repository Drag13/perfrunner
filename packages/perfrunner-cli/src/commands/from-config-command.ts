import { ICommand } from './icommand';

type ReadConfigParams = { pathToConfig: string };

export class RunTestsFromConfigCommand implements ICommand<ReadConfigParams> {
    readonly name = '--from-config';
    readonly args: ReadConfigParams;
    constructor(args: ReadConfigParams) {
        this.args = args;
    }
}
