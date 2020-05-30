import { profile as profilePage } from "./profiler/profiler";
import { PerfRunnerOptions } from './profiler/perf-options';
import { processPerfData } from "./processor/processor";
import { Db } from './db';
import { IPerformanceResult, PerfRunResult } from './db/scheme';
import { report } from './log';

export { PerfRunnerOptions }
export { IPerformanceResult }

export async function profile(options: PerfRunnerOptions): Promise<IPerformanceResult> {
    report('starting profile session');
    const rawMetrics = await profilePage(options);

    report('processing new data');
    const { pageMetrics, performanceEntries } = processPerfData(rawMetrics);

    const dataToSave: PerfRunResult = {
        timeStamp: Date.now(),
        pageMetrics,
        performanceEntries,
        runParams: { useCache: options.useCache, network: options.network, throttlingRate: options.throttlingRate, url: options.url },
        comment: options.comment
    }

    const db = Db.connect(options.output, options, options.testName);

    report('saving data');
    db.write(dataToSave, options.purge);

    report('retrieving previous data');
    return db.read();
}