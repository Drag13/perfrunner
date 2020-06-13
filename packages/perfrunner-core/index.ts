import { profile as profilePage } from "./profiler/profiler";
import { PerfRunnerOptions } from './profiler/perf-options';
import { processPerfData } from "./processor/processor";
import { Db } from './db';
import { IPerformanceResult, PerfRunResult } from './db/scheme';
import { log, throwException } from './utils/log';
import validator from "./validation/validation";

export { PerfRunnerOptions }
export { IPerformanceResult }

function writeResult(db: Db, data: PerfRunResult, purge?: boolean) {
    log('saving data');
    db.write(data, purge);
}

function readAllMetrics(db: Db) {
    log('retrieving previous data');
    return db.read();
}

export async function profile(options: PerfRunnerOptions): Promise<IPerformanceResult> {
    try { await validator.validate(options); } catch (e) { throwException(e); }

    const url = new URL(options.url);
    const db = Db.connect(url, options.output, options, options.testName);

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
            runParams: { useCache: options.useCache, network: options.network, throttlingRate: options.throttlingRate, url: options.url },
            comment: options.comment
        }

        writeResult(db, result, options.purge)
    } else {
        log('profling is tunred off, reading existing data')
    }

    return readAllMetrics(db);
}