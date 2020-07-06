import { IPerformanceResult } from './types';
import Chart, { ChartTooltipItem, ChartData } from 'chart.js';
import { isNullOrEmpty, TRANSPARENT, toBytes, defined, toMs } from '../../utils';

type RunParams = {
    download: number;
    upload: number;
    latency: number;
    useCache: boolean;
    throttling: number;
};

export interface IViewData<T> {
    data: T;
    labels: string[];
    runParams: RunParams[];
}

export abstract class AbstractChart<TData> {
    public abstract readonly type: 'chart';
    public abstract readonly name: string;

    protected abstract readonly title: string;
    protected readonly FONT_FAMILIY = `'monospace', 'Verdana', 'sans-serif'`;
    protected readonly DEFAULT_LINE_WIDTH = 2;

    protected abstract getViewData: (data: IPerformanceResult) => IViewData<TData>;
    protected abstract getDatasetEntries: (viewData: TData) => Array<any>;
    protected abstract yAxesLabelCalback(value: string | number): string;

    public render(container: HTMLCanvasElement, rawData: IPerformanceResult) {
        const ctx = this.getCanvasContext(container);
        const viewData = this.getViewData(rawData);

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: viewData.labels,
                datasets: this.getDatasetEntries(viewData.data),
            },
            options: {
                animation: this.animation,
                hover: this.hover,
                responsiveAnimationDuration: this.responsiveAnimationDuration,
                elements: this.elements,
                scales: {
                    xAxes: this.xAxes(),
                    yAxes: this.yAxes(),
                },
                legend: this.legend(),
                title: this.chartTitle(),
                tooltips: {
                    callbacks: {
                        label: this.tooltipLabel(viewData),
                        footer: this.tooltipFooter(viewData),
                    },
                },
                maintainAspectRatio: false,
            },
        });
    }

    protected animation = { duration: 0 };
    protected hover = { animationDuration: 0 };
    protected responsiveAnimationDuration = 0;
    protected elements = { line: { tension: 0 } };

    protected yAxes = (): Chart.ChartYAxe[] => [
        { ticks: { beginAtZero: true, fontFamily: this.FONT_FAMILIY, callback: this.yAxesLabelCalback } },
    ];
    protected xAxes = (): Chart.ChartXAxe[] => [{ ticks: { callback: (v: string | number) => v.toString().substring(0, 30) } }];
    protected legend = () => ({ labels: { fontFamily: this.FONT_FAMILIY } });
    protected chartTitle = () => ({ text: this.title, display: true, fontFamily: this.FONT_FAMILIY });
    protected getLabel = (index: number, comment: string | undefined) => `#${index + 1}${isNullOrEmpty(comment) ? '' : ` ${comment}`}`;
    protected runParams = (rawData: IPerformanceResult): RunParams[] =>
        rawData.map((x) => ({
            download: x.runParams.network.downloadThroughput,
            upload: x.runParams.network.uploadThroughput,
            useCache: !!x.runParams.useCache,
            latency: x.runParams.network.latency,
            throttling: x.runParams.throttlingRate,
        }));

    protected withDefaults = (label: string, data: number[], color: string) => ({
        label,
        data,
        borderColor: color,
        backgroundColor: TRANSPARENT,
        borderWidth: this.DEFAULT_LINE_WIDTH,
    });

    protected tooltipLabel = (_: IViewData<TData>) => diffLabel(toMs);
    protected tooltipFooter = ({ runParams }: IViewData<TData>) => (t: ChartTooltipItem[]) => {
        const index = t[0].index;
        if (index == null || index >= runParams.length) {
            return '';
        }
        const param = runParams[index];
        return [
            `download: ${toBytes(param.download)} upload ${toBytes(param.upload)} latency: ${param.latency}`,
            `throttling: ${param.throttling}x useCache: ${param.useCache}`,
        ];
    };

    protected getCanvasContext = (container: HTMLElement | undefined) => {
        const canvas = container as HTMLCanvasElement;

        if (canvas == null || typeof canvas.getContext !== 'function') {
            throw new Error(`EntriesChartReporter failed, provided container is not canvs`);
        }

        return canvas.getContext('2d')!;
    };
}

type TooltipLabelCallback = (t: ChartTooltipItem, d: ChartData) => string;
export const diffLabel = (formatter: (v: number) => string): TooltipLabelCallback => {
    return (t: ChartTooltipItem, d: ChartData) => {
        const entryIndex = t.index;
        const dIndex = t.datasetIndex;
        const data = d.datasets && d.datasets[dIndex!] ? d.datasets[dIndex!]?.data : undefined;

        if (!defined(entryIndex) || !defined(dIndex) || !defined(data)) {
            throw new Error('Something went wrong with labels');
        }

        const currentValue = data[entryIndex];
        const label = d.datasets![dIndex].label;

        if (typeof currentValue !== 'number') {
            return `${t.label}: ${t.value}`;
        }

        if (entryIndex === 0) {
            return `${label}: ${formatter(currentValue)}`;
        }

        if (entryIndex > 0) {
            const prev = data[entryIndex - 1] as number;
            const diff = currentValue - (prev as number);
            const formmattedDiff = `(diff: ${diff > 0 ? '+' : ''} ${formatter(diff)})`;
            return `${label}: ${formatter(currentValue)} ${formmattedDiff}`;
        }

        return label ?? '';
    };
};

export const msLabel = (value: string | number) => `${value} ms`;
export const kbLabel = (value: string | number) => (typeof value === 'number' ? toBytes(value) : toBytes(parseFloat(value)));
