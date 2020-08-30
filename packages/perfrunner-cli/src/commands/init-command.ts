import { writeFileSync, existsSync } from 'fs';

import { ICommand } from './icommand';
import { TestParams } from '../params/params';
import { withRootPath, ensureFolderCreated } from '../utils';
import { join } from 'path';
import { logger } from 'perfrunner-core';
import { HSPA_Plus, Original } from '../params/network';
import { Url } from './mapper/url';

type InitConfigParams = { pathToFolder: string; configName: string; url: string[] };

export interface Config extends Omit<TestParams, 'url'> {
    url: string[];
}

const defaultConfig: Config = {
    cache: [false],
    chromeArgs: undefined,
    comment: undefined,
    executablePath: undefined,
    ignoreDefaultArgs: false,
    logLevel: undefined,
    network: [Original, HSPA_Plus],
    noHeadless: false,
    output: './generated',
    purge: false,
    reportOnly: false,
    reporter: ['html'],
    runs: 3,
    throttling: 2,
    timeout: 90_000,
    testName: undefined,
    waitFor: undefined,
    url: [],
};

export class InitConfigCommand implements ICommand {
    readonly name = '--init';

    constructor(private readonly args: InitConfigParams) {}

    async execute() {
        const { configName, pathToFolder, url } = this.args;

        const pathToConfig = this.createSafePath(pathToFolder);

        logger.log(`Creating ${configName}...`);

        const config = { ...defaultConfig, url: url.map((x) => Url(x).href) };

        this.writeConfig(pathToConfig, configName, config);
        logger.log(`Done`);

        return 0;
    }

    private createSafePath(pathToFolder: string) {
        const pathToConfig = withRootPath(pathToFolder);
        ensureFolderCreated(pathToConfig);
        return pathToConfig;
    }

    private writeConfig(pathToConfig: string, configName: string, config: Config) {
        const fullPath = join(pathToConfig, configName);
        if (existsSync(fullPath)) {
            throw new Error('Config already exist. If you want to recreate it - delete the file first');
        }

        writeFileSync(fullPath, JSON.stringify(config, null, 4), { encoding: 'utf-8' });
    }
}
