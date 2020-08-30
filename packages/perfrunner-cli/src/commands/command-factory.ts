import { ICommand, CommandName } from './icommand';
import { RunTestsFromConfigCommand } from './from-config-command';
import { RunTestsFromConsoleCommand } from './from-console-command';
import { InitConfigCommand } from './init-command';
import { TestParams } from '../params/params';

const consoleArgumentsGuard = (v: any): v is TestParams => v && v.url;

export function getCommandFromUserInput(commandName: string, args: TestParams): ICommand {
    switch (commandName as CommandName) {
        case '--init':
            return new InitConfigCommand({ configName: './perfrunner.json', pathToFolder: '.' });
        case '--from-config':
            return new RunTestsFromConfigCommand({ configName: './perfrunner.json', pathToFolder: '.' });
        case '--from-console': {
            if (consoleArgumentsGuard(args)) {
                return new RunTestsFromConsoleCommand(args);
            } else {
                throw new Error('Bad arguments');
            }
        }
    }

    throw new Error(`CommandName: "${commandName}" is unknown`);
}
