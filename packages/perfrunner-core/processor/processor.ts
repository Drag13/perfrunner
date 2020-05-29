import { groupEntries } from './utils';
import { RawPerfData } from '../profiler/raw-perf-data';
import { ExtendedPerformanceEntry, PerformanceData } from './perf-data';

import { exclude, mergeWithRules as merge } from "./merge";
import { transform } from "./transform";

const toMiliseconds = (v: number) => v * 1000;

export const processPerfData = (rawPerformanceData: RawPerfData[]): PerformanceData => {

    const metrics = rawPerformanceData.map(x => x.metrics);
    const mergedMetrics = merge(metrics, { Timestamp: exclude });
    const normalizedMetrics = transform(mergedMetrics, { TaskDuration: toMiliseconds, RecalcStyleCount: toMiliseconds, RecalcStyleDuration: toMiliseconds, ScriptDuration: toMiliseconds, LayoutDuration: toMiliseconds });

    const perfEntries = rawPerformanceData.map(x => x.performanceEntries);
    const grouped = groupEntries(perfEntries);
    const mergedPerfEntries = grouped.map(group => merge<ExtendedPerformanceEntry>(group, { nextHopProtocol: exclude, toJSON: exclude }));

    return { pageMetrics: normalizedMetrics, performanceEntries: mergedPerfEntries };
};