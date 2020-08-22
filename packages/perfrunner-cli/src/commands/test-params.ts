import { NetworkSetup } from 'perfrunner-core';

export type TestRunConditions = {
    url: URL;
    timeout: number;
    runs: number;
    reporter: string[];
    purge: boolean;
    noHeadless: boolean;
    testName: string;
    reportOnly: boolean;
    chromeArgs: string[];
    ignoreDefaultArgs: boolean;
    waitFor: number | string;
    logLevel: string | undefined;
    output: string;
    comment: string;
    executablePath: string | undefined;
};

export type PerformanceConditions = {
    network: NetworkSetup[];
    throttling: number;
    cache: boolean[];
};

export interface TestParams extends TestRunConditions, PerformanceConditions {}