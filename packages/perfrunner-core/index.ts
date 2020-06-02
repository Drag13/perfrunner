import { profile as profilePage } from "./profiler/profiler";
import { PerfRunnerOptions } from './profiler/perf-options';
import { processPerfData } from "./processor/processor";
import { Db } from './db';
import { IPerformanceResult, PerfRunResult } from './db/scheme';
import { report } from './log';

export { PerfRunnerOptions }
export { IPerformanceResult }

function writeResult(db: Db, data: PerfRunResult, purge: boolean) {
    report('saving data');
    db.write(data, purge);
}

function readAllMetrics(db: Db) {
    report('retrieving previous data');
    return db.read();
}

export async function profile(options: PerfRunnerOptions): Promise<IPerformanceResult> {
    const db = Db.connect(options.output, options, options.testName);

    const isProfilingOn = !options.reportOnly;

    if (isProfilingOn) {
        report('starting profile session');
        const rawMetrics = await profilePage(options);

        report('processing new data');
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
        report('profling is tunred off, reading existing data')
    }

    return readAllMetrics(db);
}