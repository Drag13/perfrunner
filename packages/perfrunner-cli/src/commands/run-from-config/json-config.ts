import { NetworkSetup } from 'perfrunner-core';

export type PageSetup = {
    url: string;
    waitFor: number | string;
    onAfterPageLoadedScript: string;
};

type Network = NetworkSetup & { disabled: boolean };

export type JsonConfig = {
    cache: boolean[];
    ignoreDefaultArgs: boolean;
    network: Network[];
    noHeadless: boolean;
    output: string;
    reportOnly: boolean;
    reporter: string[];
    runs: number;
    throttling: number;
    timeout: number;
    page: PageSetup[];
    testName: string;
    logLevel: string;
    chromeArgs: string[];
    executablePath: string;
};

export type JsonConfigMetadata = {};
