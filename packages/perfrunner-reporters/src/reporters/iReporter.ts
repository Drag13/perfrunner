import { IPerformanceResult } from 'perfrunner-core';

export type ReportGenerator = (data: IPerformanceResult[], args?: string[]) => Promise<string>;
export interface IReporter {
    generateReport: ReportGenerator;
    defaultReportName: string;
}
