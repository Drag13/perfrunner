import { PerfRunnerOptions, NetworkSetup } from 'perfrunner-core';
import { ConsoleArguments } from '../arguments/args';
import { getOutputPath } from './output';

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

const map = (consoleArguments: ConsoleArguments, useCache: boolean, networkSetup: NetworkSetup) => {
    return {
        ...consoleArguments,
        url: consoleArguments.url.href,
        useCache,
        throttlingRate: consoleArguments.throttling,
        headless: !consoleArguments.noHeadless,
        output: getOutputPath(consoleArguments.output, consoleArguments.testName ?? consoleArguments.url),
        network: networkSetup,
    };
};

const flattenArguments = (consoleArguments: ConsoleArguments) => {
    const perfrunnerOptions = [];

    for (const network of consoleArguments.network) {
        for (const useCache of consoleArguments.cache) {
            perfrunnerOptions.push(map(consoleArguments, useCache, network));
        }
    }

    return perfrunnerOptions;
};

export const mapArgs = (consoleArguments: ConsoleArguments): TestParams => {
    const perfrunnerOptions = flattenArguments(consoleArguments);
    const reporterOptions = getReporterOptions(consoleArguments.reporter);

    return {
        perfrunnerOptions,
        reporterOptions,
    };
};
