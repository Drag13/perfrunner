import { join } from 'path';
import { cwd } from 'process';
import { writeFileSync } from 'fs';

import { ICommand } from './icommand';
import { TestParams } from './test-params';

type InitConfigParams = { pathToConfig: string };

export class InitConfigCommand implements ICommand<InitConfigParams> {
    readonly name = '--init';
    readonly args: InitConfigParams;

    constructor(args: InitConfigParams) {
        this.args = args;
    }

    async execute() {
        const pathToConfig = this.getFullPathToConfig();
        const defaultConfig = this.getDefaultConfig();
        writeFileSync(pathToConfig, JSON.stringify(defaultConfig), { encoding: 'utf-8' });
        return 1;
    }

    private getFullPathToConfig() {
        const { pathToConfig } = this.args;
        return join(cwd(), pathToConfig);
    }

    private getDefaultConfig() {
        const config: TestParams[] = [
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
                url: '--https://NOT_VALID_URL.io--',
                testName: undefined,
                waitFor: undefined,
            },
        ];

        return config;
    }
}
