import { writeFileSync, existsSync } from 'fs';

import { ICommand } from './icommand';
import { TestParams } from '../params/params';
import { withRootPath, ensureFolderCreated } from '../utils';
import { join } from 'path';
import { logger, NetworkSetup } from 'perfrunner-core';
import { FourG, HSPA, HSPA_Plus, Original, Slow3g } from '../params/network';
import { Url } from './mapper/url';
import { DEFAULT_OUTPUT_FOLDER, DEFAULT_REPORTER, DEFAULT_NUMBER_RUNS, DEFAULT_THROTTLING_RATE, DEFAULT_TIMEOUT } from '../config';
import { CONFIG_SHOULD_NOT_OVERRIDEN } from '../errors';

type InitConfigParams = { pathToFolder: string; configName: string; url: string[] };

type NonConfigurableOptions = 'purge' | 'comment';

type Network = NetworkSetup & { disabled: boolean };

export interface Config extends Omit<TestParams, 'url' | NonConfigurableOptions | 'network'> {
    url: string[];
    network: Network[];
}

const defaultConfig: Config = {
    cache: [false],
    chromeArgs: undefined,
    executablePath: undefined,
    ignoreDefaultArgs: false,
    logLevel: undefined,
    network: [
        { ...Original, disabled: false },
        { ...HSPA_Plus, disabled: false },
        { ...Slow3g, disabled: true },
        { ...HSPA, disabled: true },
        { ...FourG, disabled: true },
    ],
    noHeadless: false,
    output: DEFAULT_OUTPUT_FOLDER,
    reportOnly: false,
    reporter: [DEFAULT_REPORTER],
    runs: DEFAULT_NUMBER_RUNS,
    throttling: DEFAULT_THROTTLING_RATE,
    timeout: DEFAULT_TIMEOUT,
    testName: undefined,
    waitFor: undefined,
    url: [],
};

export class InitConfigCommand implements ICommand {
    readonly name = '--init';

    constructor(private readonly args: InitConfigParams) {}

    async execute() {
        const { configName, pathToFolder, url } = this.args;

        const fullPathToConfigFolder = this.getFullPathToConfigFolder(pathToFolder);
        ensureFolderCreated(fullPathToConfigFolder);
        const fullPathToConfig = this.getFullPathToConfig(fullPathToConfigFolder, configName);

        const isConfigExisted = existsSync(fullPathToConfig);

        if (isConfigExisted) {
            throw CONFIG_SHOULD_NOT_OVERRIDEN;
        }

        const config: Config = { ...defaultConfig, url: url.map((x) => Url(x).href) };

        logger.log(`Creating ${configName}...`);

        this.writeConfig(fullPathToConfig, config);

        logger.log(`Done`);

        return 0;
    }

    getFullPathToConfig = (fullPathToConfigFolder: string, configName: string) => join(fullPathToConfigFolder, configName);
    getFullPathToConfigFolder = (pathToFolder: string) => withRootPath(pathToFolder);
    writeConfig = (fullPath: string, config: Config) =>
        writeFileSync(fullPath, JSON.stringify(config, null, 4), { encoding: 'utf-8' });
}
