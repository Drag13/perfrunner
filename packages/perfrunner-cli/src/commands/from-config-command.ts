import { ICommand } from './icommand';
import { existsSync, readFileSync } from 'fs';
import { withRootPath } from '../utils';
import { join } from 'path';
import { TestParams } from '../params';
import { iterateAsync, asyncToArray } from 'perfrunner-core/dist/utils/async';
import { RunTestsFromConsoleCommand } from '.';

type ReadConfigParams = { pathToFolder: string; configName: string };

export class RunTestsFromConfigCommand implements ICommand {
    readonly name = '--from-config';
    constructor(private readonly args: ReadConfigParams) {}

    async execute() {
        const { pathToFolder, configName } = this.args;
        const pathToConfig = this.getFullPathToConfig(pathToFolder, configName);

        if (!existsSync(pathToConfig)) {
            throw new Error('Config not exists');
        }

        const config = this.readConfigFile(pathToConfig);

        if (!Array.isArray(config)) {
            throw new Error('Config is not an array, aborting...');
        }

        if (config.length === 0) {
            throw new Error('Config is empty, aborting...');
        }

        const testSuite = config.map((p) => new RunTestsFromConsoleCommand(p));

        const asyncSequence = iterateAsync(testSuite, async (testCase) => await testCase.execute());
        await asyncToArray(asyncSequence);

        return 0;
    }

    getFullPathToConfig = (pathToFolder: string, configName: string) => join(withRootPath(pathToFolder), configName);

    readConfigFile = (fullPathToConfig: string): TestParams[] => JSON.parse(readFileSync(fullPathToConfig, { encoding: 'utf-8' }));
}
