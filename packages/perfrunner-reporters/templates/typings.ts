type PerformanceResult = import("perfrunner-core").IPerformanceResult;

export interface IPerformanceResult extends PerformanceResult { }

export interface IUtils {
    colors: { transparent: string; }
    formatters: {
        toMs: (v: number) => string
    }
}

export interface IChartOptions extends Chart.ChartOptions { }