import { PerfRunnerOptions, NetworkSetup } from 'perfrunner-core';
import { TestParams as InputParams } from '../../params/params';
import { Url } from './url';
import { getOutputPathFromUrl, getOutputPathFromtestName } from './output';

type ReporterOptions = { name: string; params: string[] };
function getReporterOptions(args: string[]): ReporterOptions {
    const [reporterName, ...params] = args;
    return {
        name: reporterName,
        params: params ?? [],
    };
}

export type TestParams = {
    perfrunnerOptions: PerfRunnerOptions[];
    reporterOptions: ReporterOptions;
};

const map = (consoleArguments: InputParams, useCache: boolean, networkSetup: NetworkSetup) => {
    return {
        ...consoleArguments,
        url: Url(consoleArguments.url).href,
        useCache,
        throttlingRate: consoleArguments.throttling,
        headless: !consoleArguments.noHeadless,
        output: consoleArguments.testName
            ? getOutputPathFromtestName(consoleArguments.output, consoleArguments.testName)
            : getOutputPathFromUrl(consoleArguments.output, consoleArguments.url),
        network: networkSetup,
    };
};

const flattenArguments = (consoleArguments: InputParams) => {
    const perfrunnerOptions = [];

    for (const network of consoleArguments.network) {
        for (const useCache of consoleArguments.cache) {
            perfrunnerOptions.push(map(consoleArguments, useCache, network));
        }
    }

    return perfrunnerOptions;
};

export const mapArgs = (consoleArguments: InputParams): TestParams => {
    const perfrunnerOptions = flattenArguments(consoleArguments);
    const reporterOptions = getReporterOptions(consoleArguments.reporter);

    return {
        perfrunnerOptions,
        reporterOptions,
    };
};
