import { IPerformanceResult as PerformanceResult } from 'perfrunner-core';

export interface IPerformanceResult extends PerformanceResult {}

export interface IChartOptions extends Chart.ChartOptions {}

export interface IReporter<TTarget> {
    type: 'chart' | 'text';
    name: string;
    render(container: TTarget, data: IPerformanceResult): void;
}
