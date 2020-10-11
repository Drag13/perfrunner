import { NetworkSetup } from 'perfrunner-core';

export type TestRunConditions = {
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
    onAfterPageLoaded: (() => void) | undefined;
};

export type PerformanceConditions = {
    network: NetworkSetup[];
    throttling: number;
    cache: boolean[];
};

export interface TestParams extends TestRunConditions, PerformanceConditions {}
