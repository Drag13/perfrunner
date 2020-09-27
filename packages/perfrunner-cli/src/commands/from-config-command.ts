import { ICommand } from './icommand';
import { existsSync, readFileSync } from 'fs';
import { withRootPath } from '../utils';
import { join } from 'path';
import { iterateAsync, asyncToArray } from 'perfrunner-core/dist/utils/async';
import { RunTestsFromConsoleCommand } from './from-console-command';
import { Config } from './init-command';
import { logger } from 'perfrunner-core';
import { CONFIG_NOT_EXISTS } from '../errors';

type ReadConfigParams = { pathToFolder: string; configName: string };

export class RunTestsFromConfigCommand implements ICommand {
    readonly name = '--from-config';
    constructor(private readonly args: ReadConfigParams) {}

    async execute() {
        const { pathToFolder, configName } = this.args;
        logger.log(`Loading ${configName}`);
        const pathToConfig = this.getFullPathToConfig(pathToFolder, configName);

        if (!existsSync(pathToConfig)) {
            throw CONFIG_NOT_EXISTS;
        }

        const config = this.readConfigFile(pathToConfig);

        const testSuite = config.url.map(
            (url) =>
                new RunTestsFromConsoleCommand({
                    ...config,
                    url,
                    purge: false,
                    comment: undefined,
                    network: config.network.filter((x) => !x.disabled),
                })
        );

        const asyncSequence = iterateAsync(testSuite, async (testCase) => await testCase.execute());
        await asyncToArray(asyncSequence);

        return 0;
    }

    private getFullPathToConfig = (pathToFolder: string, configName: string) => join(withRootPath(pathToFolder), configName);

    private readConfigFile = (fullPathToConfig: string): Config => JSON.parse(readFileSync(fullPathToConfig, { encoding: 'utf-8' }));
}
