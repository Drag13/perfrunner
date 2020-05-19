import { mergeWithRules, RuleSet, groupEntries } from './utils';
import { RawPerfData } from '../profiler/raw-perf-data';
import { ExtendedPerformanceEntry, PerformanceData } from './perf-data';

const performanceEntryTransformMap: RuleSet<ExtendedPerformanceEntry> = {
    nextHopProtocol: 'exclude',
    toJSON: 'exclude',
}

export const processPerfData = (rawPerformanceData: RawPerfData[]): PerformanceData => {

    const metrics = rawPerformanceData.map(x => x.metrics);
    const mergedMetrics = mergeWithRules(metrics, { Timestamp: 'exclude' });

    const perfEntries = rawPerformanceData.map(x => x.performanceEntries);
    const grouped = groupEntries(perfEntries);
    const mergedPerEntries = grouped.map(group => mergeWithRules<ExtendedPerformanceEntry>(group, performanceEntryTransformMap))

    return { pageMetrics: mergedMetrics, performanceEntries: mergedPerEntries };
};