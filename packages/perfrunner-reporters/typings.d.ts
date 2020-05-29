type PerformanceResult = import("perfrunner-core").IPerformanceResult;

interface IPerformanceResult extends PerformanceResult { }

interface IUtils { colors: { transparent: string; } }

interface IChartOptions extends Chart.ChartOptions { }
