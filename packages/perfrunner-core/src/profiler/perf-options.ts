export type NetworkSetup = {
    /**
     * Sets latency for the test run
     */
    latency: number;

    /**
     * Sets download throughput for the test run
     */
    downloadThroughput: number;

    /**
     * Sets upload throughput for the test run
     */
    uploadThroughput: number;

    /**
     * Sets optional name for the network conditions
     */
    name?: string;
};

export interface PerfOptions {
    /**
     * Sets url you want to profile. Should be valid URL with http scheme provided
     */
    url: string;

    /**
     * Sets network conditions for the test run
     */
    network: NetworkSetup;

    /**
     * Sets CPU throttling rate for the test run
     */
    throttlingRate: number;

    /**
     * Sets cache policy for the test run. Enable browser cache if set to true
     */
    useCache?: boolean;
}

export interface ILaunchOptions {
    /**
     * Sets timeout for the test
     */
    timeout: number;

    /**
     * Sets headless mode for the browser
     */
    headless?: boolean;

    /**
     * Sets list of chrome arguments
     */
    chromeArgs?: string[];

    /**
     * Sets flag to ignore default arguments
     */
    ignoreDefaultArgs?: boolean;

    /**
     * Sets path to the Chrome instance
     */
    executablePath?: string;
}

export interface RunnerOptions {
    /**
     * Sets number of runs you want to execute
     */
    runs: number;

    /**
     * Sets time (in miliseconds) or selector you want to wait for
     */
    waitFor?: number | string;

    /**
     * Sets folder to store data
     */
    output: string;

    /**
     * Cleanup DB before testing
     */
    purge?: boolean;

    /**
     * Sets comment for the current test
     */
    comment?: string;

    /**
     * Sets name of the performance test. If provided, will be used as folder name for the test
     */
    testName?: string;

    /**
     * Sets to report only mode. No tests will be executed, but data will be read and returned if exists
     */
    reportOnly?: boolean;

    /**
     * Sets function that should be executed after page loaded. If function returns promise, page will wait untill the promise resolved
     */
    afterPageLoaded?: () => any;
}

export interface PerfRunnerOptions extends PerfOptions, RunnerOptions, ILaunchOptions {}
