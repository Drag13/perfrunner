import { ICommand, CommandName } from './icommand';
import { RunTestsFromConfigCommand } from './from-config-command';
import { RunTestsFromConsoleCommand } from './from-console-command';
import { InitConfigCommand } from './init-command';
import { TestParams } from './test-params';

const consoleArgumentsGuard = (v: any): v is TestParams => v && v.url;

export function createCommand(cmd: string, args: unknown): ICommand<unknown> {
    switch (cmd as CommandName) {
        case '--init':
            return new InitConfigCommand({ pathToConfig: './perfrunner.json' });
        case '--from-config':
            return new RunTestsFromConfigCommand({ pathToConfig: './perfrunner.json' });
        case '--from-console': {
            if (consoleArgumentsGuard(args)) {
                return new RunTestsFromConsoleCommand(args);
            } else {
                throw new Error('Bad arguments');
            }
        }
    }

    throw new Error(`CommandName: "${cmd}" is unknown`);
}
