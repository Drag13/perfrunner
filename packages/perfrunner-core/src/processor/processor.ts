import { groupEntries } from './utils';
import { RawPerfData } from '../profiler/types';
import { PerformanceData } from './perf-data';

import { exclude, mergeWithRules as merge } from './merge';
import { transform } from './transform';
import { ExtendedPerformanceEntry } from '../profiler/types';

const toMiliseconds = (v: number | undefined) => (v ?? 0) * 1000;

export const processPerfData = (rawPerformanceData: RawPerfData[]): PerformanceData => {
    const metrics = rawPerformanceData.map((x) => x.metrics);
    const mergedMetrics = merge(metrics, { Timestamp: exclude });
    const normalizedMetrics = transform(mergedMetrics, {
        TaskDuration: toMiliseconds,
        RecalcStyleCount: toMiliseconds,
        RecalcStyleDuration: toMiliseconds,
        ScriptDuration: toMiliseconds,
        LayoutDuration: toMiliseconds,
    });

    const perfEntries = rawPerformanceData.map((x) => x.performanceEntries);
    const grouped = groupEntries(perfEntries);

    const mergedPerfEntries = grouped.map((group) =>
        merge<ExtendedPerformanceEntry>(group, { nextHopProtocol: exclude, toJSON: exclude, element: exclude })
    );

    return { pageMetrics: normalizedMetrics, performanceEntries: mergedPerfEntries };
};
