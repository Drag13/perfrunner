import cmd from 'command-line-args';
import { definitions, ConsoleArguments } from '../arguments/args';

type CommandName = '--from-console' | '--init' | '--from-config' | '_';

export interface ICommand<T> {
    readonly name: CommandName;
    readonly args: T;
}

export class RunTestsCommand implements ICommand<ConsoleArguments> {
    readonly name = '--from-console';
    readonly args: ConsoleArguments;

    constructor(args: ConsoleArguments) {
        this.args = args;
    }
}

type GenerateConfigParams = { pathToConfig: string };

export class GenerateConfigCommand implements ICommand<GenerateConfigParams> {
    readonly name = '--init';
    readonly args: GenerateConfigParams;

    constructor(args: GenerateConfigParams) {
        this.args = args;
    }
}

type ReadConfigParams = { pathToConfig: string };

export class ReadConfigCommand implements ICommand<ReadConfigParams> {
    readonly name = '--from-config';
    readonly args: ReadConfigParams;
    constructor(args: ReadConfigParams) {
        this.args = args;
    }
}

const consoleArgumentsGuard = (v: any): v is ConsoleArguments => v && v.url;

function createCommand(cmd: string, args: unknown): ICommand<unknown> {
    switch (cmd as CommandName) {
        case '--init':
            return new GenerateConfigCommand({ pathToConfig: './perfrunner.json' });
        case '--from-config':
            return new ReadConfigCommand({ pathToConfig: './perfrunner.json' });
        case '--from-console': {
            if (consoleArgumentsGuard(args)) {
                return new RunTestsCommand(args);
            } else {
                throw new Error('Bad arguments');
            }
        }
    }

    throw new Error(`CommandName: "${cmd}" is unknown`);
}

export function getCommandFromArguments(): ICommand<unknown> {
    const input = cmd(definitions, { camelCase: true, stopAtFirstUnknown: true });

    const commandName = input._unknown == null ? '--from-console' : input._unknown[0];
    const command = createCommand(commandName, input);

    return command;
}
