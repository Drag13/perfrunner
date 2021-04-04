import { ExtendedPerformanceEntry, Metrics } from 'perfrunner-core';
import { numberOrZero } from './numbers';

export const getFCP = (performanceEntries: ExtendedPerformanceEntry[]) =>
    Math.round(performanceEntries.find((x) => x.name === 'first-contentful-paint')?.startTime ?? 0);

export const getFP = (performanceEntries: ExtendedPerformanceEntry[]) =>
    Math.round(performanceEntries.find((x) => x.name === 'first-paint')?.startTime ?? 0);

export const getLCP = (performanceEntries: ExtendedPerformanceEntry[]) => {
    const lcpEvent = performanceEntries.find((x) => x.entryType === 'largest-contentful-paint');
    return Math.round(lcpEvent?.renderTime || lcpEvent?.loadTime || 0);
};

export const getDomInteractive = (performanceEntries: ExtendedPerformanceEntry[]) => {
    const event = performanceEntries.find((x) => x.entryType === 'navigation');
    return Math.round(event?.domInteractive || 0);
};

export const getScriptDuration = (metric: Metrics) => Math.round(numberOrZero(metric.ScriptDuration));

export const getLayoutDuration = (metric: Metrics) => Math.round(numberOrZero(metric.LayoutDuration));

export const getRecalculateStyleDuration = (metric: Metrics) => Math.round(numberOrZero(metric.RecalcStyleDuration));

export const getNavigationEvent = (performanceEntries: ExtendedPerformanceEntry[]) =>
    performanceEntries.find((x) => x.entryType === 'navigation');
