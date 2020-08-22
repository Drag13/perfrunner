import { ICommand } from './icommand';

type InitConfigParams = { pathToConfig: string };

export class InitConfigCommand implements ICommand<InitConfigParams> {
    readonly name = '--init';
    readonly args: InitConfigParams;

    constructor(args: InitConfigParams) {
        this.args = args;
    }
}