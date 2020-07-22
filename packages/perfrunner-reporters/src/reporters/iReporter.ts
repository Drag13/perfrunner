import { IPerformanceResult } from 'perfrunner-core';

export interface IReporter {
    (outputFolder: string, data: IPerformanceResult, args?: string[]): Promise<number>;
}
