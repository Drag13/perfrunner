import { IPerformanceResult } from 'perfrunner-core';

export interface IReporter {
    (to: string, data: IPerformanceResult): void
}