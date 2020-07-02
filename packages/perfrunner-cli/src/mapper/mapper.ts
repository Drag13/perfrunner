import { PerfRunnerOptions } from 'perfrunner-core';
import { ConsoleArguments } from '../arguments/args';
import { resolve } from 'path';

const generateFriendlyNameFromUrl = (url: URL): string => {
    const friendlyHost = url.host.replace(/[\.:]/g, '_'); // remove . and : from host
    const friendlyPath = url.pathname && url.pathname !== '/' ? `__${url.pathname.replace(/[\\]/g, '_')}` : ''; // remove /

    return `${friendlyHost}${friendlyPath}`;
};

type ReporterOptions = { name: string; params: string[] };
function getReporterOptions(args: string[]): ReporterOptions {
    const [reporterName, ...params] = args;
    return {
        name: reporterName,
        params: params ?? [],
    };
}

function getOutputPath(rootOutputFolder: string, testName: string): string;
function getOutputPath(rootOutputFolder: string, url: URL): string;
function getOutputPath(rootOutputFolder: string, target: URL | string): string {
    const subfolder = typeof target === 'string' ? target : generateFriendlyNameFromUrl(target);

    return resolve(process.cwd(), rootOutputFolder, subfolder);
}

export const mapArgs = (consoleArguments: ConsoleArguments): { perfrunnerOptions: PerfRunnerOptions; reporterOptions: ReporterOptions } => {
    const { output, url } = consoleArguments;

    const outputPath = getOutputPath(output, url);

    const perfrunnerOptions = {
        ...consoleArguments,
        url: consoleArguments.url.href,
        useCache: consoleArguments.cache,
        throttlingRate: consoleArguments.throttling,
        headless: !consoleArguments.noHeadless,
        output: outputPath,
    };

    const reporterOptions = getReporterOptions(consoleArguments.reporter);

    return {
        perfrunnerOptions,
        reporterOptions,
    };
};
