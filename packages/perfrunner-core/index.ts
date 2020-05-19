import { profile as profilePage } from "./profiler/profiler";
import { PerfRunnerOptions } from './profiler/perf-options';
import { processPerfData } from "./processor/processor";
import { db } from './db/db';
import { PerfRunResult, IPerformanceResult } from './db/perf-run-result';

export { PerfRunnerOptions }
export { IPerformanceResult }

export async function profile(options: PerfRunnerOptions): Promise<IPerformanceResult> {
    const rawMetrics = await profilePage(options);
    const { pageMetrics, performanceEntries } = processPerfData(rawMetrics);

    const dataToSave: PerfRunResult = { timeStamp: Date.now(), pageMetrics, performanceEntries, runParams: { useCache: options.useCache, network: options.network, throttlingRate: options.throttlingRate, url: options.url } }
    db.saveData(options.output, dataToSave);
    return db.readData(options.output, dataToSave.runParams);
}