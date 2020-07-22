import { validateArguments } from './validation/validation';
import { runProfilingSession } from './profiler/profiler';
import { Db, getConnectionString } from './db';
import { PerfRunnerOptions } from './profiler/perf-options';
import { processPerfData } from './processor/processor';
import { log } from './logger';
import { IPerformanceResult, PerfRunResult } from './db/scheme';

/**
 * Profile given URL and returns performance data
 * @param {PerfRunnerOptions} options Profiling parameters
 * @returns {Promise<IPerformanceResult>} performance result
 */
export async function profile(options: PerfRunnerOptions): Promise<IPerformanceResult> {
    validateArguments(options);

    const url = new URL(options.url);
    const connectionString = getConnectionString(options.output, url, options.testName);
    const db = Db.connect(connectionString);

    if (!options.reportOnly) {
        log(`starting profile session for ${url.href}`);
        const rawPerformanceResult = await runProfilingSession(
            {
                args: options.chromeArgs,
                executablePath: options.executablePath,
                headless: !!options.headless,
                ignoreDefaultArgs: !!options.ignoreDefaultArgs,
                product: 'chrome',
                timeout: options.timeout,
            },
            {
                network: options.network,
                throttlingRate: options.throttlingRate,
                url: url,
                useCache: !!options.useCache,
                waitFor: options.waitFor,
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

        log('saving data...');
        db.write(performanceResult, options.purge);
    }

    log('returning performance results');
    return db.read();
}
