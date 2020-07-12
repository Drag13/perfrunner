import { PerfRunnerOptions } from 'perfrunner-core';
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

export const mapArgs = (consoleArguments: ConsoleArguments): TestParams => {
    const { output, url, testName } = consoleArguments;

    const outputPath = getOutputPath(output, testName ?? url);

    const perfrunnerOptions = consoleArguments.network.map((networkSetup) => ({
        ...consoleArguments,
        url: consoleArguments.url.href,
        useCache: consoleArguments.cache,
        throttlingRate: consoleArguments.throttling,
        headless: !consoleArguments.noHeadless,
        output: outputPath,
        network: networkSetup,
    }));

    const reporterOptions = getReporterOptions(consoleArguments.reporter);

    return {
        perfrunnerOptions,
        reporterOptions,
    };
};
