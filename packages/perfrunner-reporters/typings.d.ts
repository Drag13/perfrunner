type PerformanceResult = import("perfrunner-core").IPerformanceResult;

interface IPerformanceResult extends PerformanceResult { }

interface IUtils { }

interface IChartOptions extends Chart.ChartOptions { }

interface IReporterPlugin<T> {
    name: string;
    type: 'chart' | 'text';
    render(container: HTMLElement, data: IPerformanceResult, utils: IUtils, defaultOptions?: T): void;
}

interface Window {
    renderer: {
        registerPlugin<T>(plugin: IReporterPlugin<T>): void;
        render(root: string, reporters: string[], data: IPerformanceResult): void;
    }
}