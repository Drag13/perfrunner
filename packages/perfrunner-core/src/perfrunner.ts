import { profile as profilePage } from './profiler/profiler';
import { Db } from './db';
import { PerfRunnerOptions } from './profiler/perf-options';
import { processPerfData } from './processor/processor';
import { log, error } from './logger';
import { IPerformanceResult, PerfRunResult } from './db/scheme';
import validator from './validation/validation';

export async function profile(options: PerfRunnerOptions): Promise<IPerformanceResult> {
    try {
        await validator.validate(options);
    } catch (e) {
        error(e);
        throw e;
    }

    const url = new URL(options.url);
    const db = Db.connect(url, options.output, options.testName);

    const isProfilingOn = !options.reportOnly;

    if (isProfilingOn) {
        log(`starting profile session for ${url.href}`);

        const rawMetrics = await profilePage(url, options);

        log('processing new data');
        const { pageMetrics, performanceEntries } = processPerfData(rawMetrics);

        const result: PerfRunResult = {
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

        log('saving data');
        db.write(result, options.purge);
    } else {
        log('profling is tunred off, reading existing data');
    }

    return db.read();
}
