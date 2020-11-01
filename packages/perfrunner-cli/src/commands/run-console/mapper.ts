import { NetworkSetup, PerfRunnerOptions } from 'perfrunner-core';
import { getOutputPathFromtestName, getOutputPathFromUrl } from '../../utils';

type ConsoleConfig = {
    url: string;
    timeout: number;
    runs: number;
    reporter: string[];
    purge: boolean;
    noHeadless: boolean;
    testName: string | undefined;
    reportOnly: boolean;
    chromeArgs: string[] | undefined;
    ignoreDefaultArgs: boolean;
    waitFor: number | string | undefined;
    logLevel: string | undefined;
    output: string;
    comment: string | undefined;
    executablePath: string | undefined;
    network: NetworkSetup[];
    throttling: number;
    cache: boolean[];
};

const map = (config: ConsoleConfig, useCache: boolean, network: NetworkSetup): PerfRunnerOptions => ({
    network,
    comment: config.comment,
    chromeArgs: config.chromeArgs,
    executablePath: config.executablePath,
    ignoreDefaultArgs: config.ignoreDefaultArgs,
    useCache,
    purge: config.purge,
    reportOnly: config.reportOnly,
    headless: !config.noHeadless,
    throttlingRate: config.throttling,
    runs: config.runs,
    timeout: config.timeout,
    url: config.url,
    testName: config.testName,
    waitFor: config.waitFor,
    output: config.testName
        ? getOutputPathFromtestName(config.output, config.testName)
        : getOutputPathFromUrl(config.output, config.url),
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
