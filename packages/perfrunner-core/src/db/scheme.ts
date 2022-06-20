import { PerfRunResult } from '../types/perfrunresult';

/**
 * List of the all perfromance runs for the given URL or testName
 */
export type IPerformanceResult = PerfRunResult;

export type DbSchema = {
    profile: PerfRunResult[];
    count: number;
};
