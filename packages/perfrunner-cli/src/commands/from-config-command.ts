import { ICommand } from './icommand';
import { existsSync, readFileSync } from 'fs';
import { withRootPath } from '../utils';
import { join } from 'path';
import { iterateAsync, asyncToArray } from 'perfrunner-core/dist/utils/async';
import { RunTestsFromConsoleCommand } from './from-console-command';
import { Config } from './init-command';

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

        const testSuite = config.url.map((url) => new RunTestsFromConsoleCommand({ ...config, url }));

        const asyncSequence = iterateAsync(testSuite, async (testCase) => await testCase.execute());
        await asyncToArray(asyncSequence);

        return 0;
    }

    getFullPathToConfig = (pathToFolder: string, configName: string) => join(withRootPath(pathToFolder), configName);

    readConfigFile = (fullPathToConfig: string): Config => JSON.parse(readFileSync(fullPathToConfig, { encoding: 'utf-8' }));
}
