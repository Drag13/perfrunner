import { validateArguments } from './validation/validation';
import { runProfilingSession } from './profiler/profiler';
import { PerfRunnerOptions } from './profiler/perf-options';
import { processPerfData } from './processor/processor';
import { log } from './logger';
import { IPerformanceResult } from './db/scheme';
import { PerfRunResult } from './types/perfrunresult';

/**
 * Profile given URL and returns performance data
 * @param {PerfRunnerOptions} options Profiling parameters
 * @returns {Promise<IPerformanceResult>} performance result
 */
export async function profile(options: PerfRunnerOptions): Promise<IPerformanceResult> {
    validateArguments(options);

    const url = new URL(options.url);
    // const connectionString = getConnectionString(options.output, url, options.testName);
    //  const db = storage ?? new Db(connectionString);

    const conditions = `network: ${options.network.name != undefined ? options.network.name : 'custom'}; throttling: ${
        options.throttlingRate
    }x, ${options.useCache ? `with cache` : `no cache`}`;

    log(`starting profile session for ${url.href}`);
    log(conditions);

    const { executablePath, timeout, network, throttlingRate, waitFor, afterPageLoaded } = options;

    const rawPerformanceResult = await runProfilingSession(
        {
            args: options.chromeArgs,
            executablePath: executablePath,
            headless: !!options.headless,
            ignoreDefaultArgs: !!options.ignoreDefaultArgs,
            product: 'chrome',
            timeout: timeout,
        },
        {
            network: network,
            throttlingRate: throttlingRate,
            url: url,
            useCache: !!options.useCache,
            waitFor: waitFor,
            afterPageLoaded,
        },
        options.runs,
        options.output
    );

    log('processing data...');
    const { pageMetrics, performanceEntries } = processPerfData(rawPerformanceResult);

    const performanceResult: PerfRunResult = {
        timeStamp: Date.now(),
        pageMetrics,
        performanceEntries,
        runParams: {
            useCache: options.useCache,
            network: options.network,
            throttlingRate: options.throttlingRate,
            url: options.url,
        },
        comment: options.comment,
    };

    //log('saving data...');
    // await db.write(performanceResult, options.purge);

    // const result = await db.read();

    return performanceResult;
}
