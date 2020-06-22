import { ChartTooltipItem, ChartData } from 'chart.js';
import { TRANSPARENT, toBytes, isNullOrEmpty, defined } from '../../../utils';
import { IChartOptions, IPerformanceResult, IReporter } from './types';

type RunParams = {
    download: number;
    upload: number;
    latency: number;
    useCache: boolean;
    throttling: number;
};

const DEFAULT_FONT_FAMILY = `'monospace', 'Verdana', 'sans-serif'`;

export abstract class AbstractChart implements IReporter<HTMLCanvasElement> {
    protected abstract readonly title: string;

    protected readonly DEFAULT_LINE_WIDTH = 2;

    protected getDefaultChartOptions = (): IChartOptions => ({
        animation: { duration: 0 },
        hover: { animationDuration: 0 },
        responsiveAnimationDuration: 0,
        elements: { line: { tension: 0 } },
        scales: {
            yAxes: [{ ticks: { beginAtZero: true, fontFamily: DEFAULT_FONT_FAMILY } }],
        },
        legend: {
            labels: {
                fontFamily: DEFAULT_FONT_FAMILY,
            },
        },
        title: {
            text: this.title,
            display: true,
            fontFamily: DEFAULT_FONT_FAMILY,
        },
    });

    abstract readonly type: 'chart';
    abstract readonly name: string;

    protected getSafeCanvasContext(container: HTMLElement | undefined): CanvasRenderingContext2D {
        const canvas = container as HTMLCanvasElement;

        if (canvas == null || typeof canvas.getContext !== 'function') {
            throw new Error(`EntriesChartReporter failed, provided container is not canvs`);
        }

        return canvas.getContext('2d')!;
    }

    abstract render(container: HTMLCanvasElement, data: IPerformanceResult): void;

    protected renderComment = (comments: string[]) => (t: ChartTooltipItem[]) => {
        const index = t[0].index;
        return index == null || index >= comments.length ? '' : comments[index] ?? '';
    };

    protected getLabel = (index: number, comment: string | undefined) => `#${index + 1}${isNullOrEmpty(comment) ? '' : ` ${comment}`}`;

    protected renderRunParams = (runParams: RunParams[]) => (t: ChartTooltipItem[]) => {
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

    protected getComments = (rawData: IPerformanceResult) => rawData.map((x) => x.comment ?? '');
    protected getRunParams = (rawData: IPerformanceResult): RunParams[] =>
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
}

export class MsChart {
    public static diffLabel(formatter: (v: number) => string): (t: ChartTooltipItem, d: ChartData) => string {
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
    }
}
