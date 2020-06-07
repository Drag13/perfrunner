export type NetworkSetup = {
    latency: number,
    downloadThroughput: number
    uploadThroughput: number,
    offline: false;
}

export interface PerfOptions {
    url: URL,
    network: NetworkSetup,
    throttlingRate: number,
    useCache: boolean
};

export interface RunnerOptions {
    runs: number;
    timeout: number;
    headless: boolean;
    waitFor?: number | string;
    chromeArgs?: string[];
    ignoreDefaultArgs?: boolean;
}

export interface PerfRunnerOptions extends PerfOptions, RunnerOptions {
    output: string;
    purge: boolean;
    comment?: string;
    testName?: string;
    reportOnly?: boolean;
}
