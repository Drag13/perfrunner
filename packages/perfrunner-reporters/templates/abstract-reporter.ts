import { IUtils, IPerformanceResult } from './typings';

export abstract class AbstractReporter<TTarget extends HTMLElement, TOptions>{
    abstract type: 'chart';
    abstract name: string;
    constructor(protected readonly _utils: IUtils) { };
    abstract render(container: TTarget, data: IPerformanceResult, _: IUtils, defaultOptions?: TOptions): void;

    getSafeCanvasContext(container: HTMLElement | undefined): CanvasRenderingContext2D {
        const canvas = container as HTMLCanvasElement;

        if (canvas == null || typeof canvas.getContext !== 'function') {
            throw new Error(`EntriesChartReporter failed, provided container is not canvs`)
        }

        return canvas.getContext('2d')!;
    }

    protected renderComment = (comments: string[]) => (t: Chart.ChartTooltipItem[]) => {
        const index = t[0].index;
        return index == null || index >= comments.length ? '' : comments[index] ?? '';
    }

    protected getComments = (rawData: IPerformanceResult) => rawData.map(x => x.comment ?? '');
}

export class MsChart {
    public static diffLabel(formatter: (v: number) => string): (t: Chart.ChartTooltipItem, d: Chart.ChartData) => string {

        return (t: Chart.ChartTooltipItem, d: Chart.ChartData, ) => {

            const entryIndex = t.index;
            const currentValue = d.datasets[t.datasetIndex].data[t.index];
            const label = d.datasets![t.datasetIndex!].label;

            if (typeof currentValue !== "number") { return `${t.label}: ${t.value}`; }

            if (entryIndex === 0) {
                return `${label}: ${formatter(currentValue)}`
            }

            if (entryIndex > 0) {
                const first = d.datasets[t.datasetIndex].data[0] as number;
                const diff = currentValue - (first as number);
                const formmattedDiff = `(diff: ${diff > 0 ? '+' + formatter(diff) : formatter(diff)})`
                return `${label}: ${formatter(currentValue)} ${formmattedDiff}`;
            }
        }
    }
}
