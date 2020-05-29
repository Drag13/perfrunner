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
