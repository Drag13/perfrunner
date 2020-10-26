import { NetworkSetup, PerfRunnerOptions } from 'perfrunner-core';
import { ConsoleConfig } from './console-config';

const map = (config: ConsoleConfig, useCache: boolean, network: NetworkSetup): PerfRunnerOptions => ({
    output: config.output,
    network,
    comment: config.comment,
    chromeArgs: config.chromeArgs,
    executablePath: config.executablePath,
    ignoreDefaultArgs: config.ignoreDefaultArgs,
    useCache: useCache,
    purge: config.purge,
    reportOnly: config.reportOnly,
    headless: config.noHeadless,
    throttlingRate: config.throttling,
    runs: config.runs,
    timeout: config.timeout,
    url: config.url,
    testName: config.testName,
    waitFor: config.waitFor,
});

export function mapConfigToPerfOptions(config: ConsoleConfig): PerfRunnerOptions[] {
    const options: PerfRunnerOptions[] = [];
    for (const network of config.network) {
        for (const useCache of config.cache) {
            options.push(map(config, useCache, network));
        }
    }

    return options;
}
