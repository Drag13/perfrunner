import { writeFileSync } from 'fs';

import { ICommand } from './icommand';
import { TestParams } from '../params';
import { withRootPath, ensureFolderCreated } from '../utils';
import { join } from 'path';
import { logger } from 'perfrunner-core';

type InitConfigParams = { pathToFolder: string; configName: string };

const defaultConfig: TestParams[] = [
    {
        cache: [false],
        chromeArgs: undefined,
        comment: undefined,
        executablePath: undefined,
        ignoreDefaultArgs: false,
        logLevel: undefined,
        network: [{ downloadThroughput: (4 * 1024 * 1024) / 8, uploadThroughput: (1 * 1024 * 1024) / 8, latency: 100 }],
        noHeadless: false,
        output: './generated',
        purge: false,
        reportOnly: false,
        reporter: ['html'],
        runs: 3,
        throttling: 2,
        timeout: 90_000,
        url: 'https://drag13.io',
        testName: undefined,
        waitFor: undefined,
    },
];

export class InitConfigCommand implements ICommand {
    readonly name = '--init';

    constructor(private readonly args: InitConfigParams) {}

    async execute() {
        const { configName, pathToFolder } = this.args;
        const pathToConfig = this.createSafePath(pathToFolder);

        logger.log(`Creating ${configName}...`);
        this.writeConfig(pathToConfig, configName);
        logger.log(`Done`);

        return 0;
    }

    private createSafePath(pathToFolder: string) {
        const pathToConfig = withRootPath(pathToFolder);
        ensureFolderCreated(pathToConfig);
        return pathToConfig;
    }

    private writeConfig(pathToConfig: string, configName: string) {
        const fullPath = join(pathToConfig, configName);
        writeFileSync(fullPath, JSON.stringify(defaultConfig, null, 4), { encoding: 'utf-8' });
    }
}
