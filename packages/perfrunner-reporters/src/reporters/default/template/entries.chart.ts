import Chart from 'chart.js';
import { AbstractChart, MsChart } from "./abstract-chart";
import { IPerformanceResult } from './types';
import { color, TRANSPARENT, toMs, init0 } from '../../../utils';

type ChartData = {
    fcp: number[],
    fp: number[],
    labels: string[],
}

export class EntriesChartReporter extends AbstractChart {

    type: 'chart' = 'chart';
    name: string = 'entries';

    render(container: HTMLCanvasElement, data: IPerformanceResult): void {
        const ctx = this.getSafeCanvasContext(container);

        const viewData = this.transform(data);
        const comments = this.getComments(data);

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: viewData.labels,
                datasets: [
                    {
                        label: 'First Contentful Paint',
                        data: viewData.fcp,
                        borderColor: color(0),
                        borderWidth: this.DEFAULT_LINE_WIDTH,
                        backgroundColor: TRANSPARENT,
                    },
                    {
                        label: "First Paint",
                        data: viewData.fp,
                        borderColor: color(1),
                        borderWidth: this.DEFAULT_LINE_WIDTH,
                        backgroundColor: TRANSPARENT,
                    }
                ]
            },
            options: {
                ...this.DEFAULT_CHART_OPTIONS,
                tooltips: {
                    callbacks: {
                        label: MsChart.diffLabel(toMs),
                        afterBody: this.renderComment(comments),
                    }
                },
                title: {
                    display: true,
                    text: "Application Events"
                }
            }
        });
    }

    private transform(rawData: IPerformanceResult): ChartData {
        if (!Array.isArray(rawData)) { throw new Error('data is not in array format') };

        const length = rawData.length;
        const chartData = { fcp: init0(length), fp: init0(length), labels: init0(length), } as ChartData;

        return rawData.reduce((acc, v, i) => {
            const fcpEvent = v.performanceEntries.find(x => x.name === 'first-contentful-paint');
            acc.fcp[i] = (fcpEvent ? fcpEvent.startTime : 0);

            const fpEvent = v.performanceEntries.find(x => x.name === 'first-paint');
            acc.fp[i] = (fpEvent ? fpEvent.startTime : 0);

            acc.labels[i] = `#${i + 1}`;

            return acc;
        }, chartData);
    }
}