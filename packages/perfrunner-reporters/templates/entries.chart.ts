import Chart from 'chart.js';
import { AbstractReporter, MsChart } from "./abstract-reporter";
import { IPerformanceResult, IChartOptions, IUtils } from './typings';

type ChartData = {
    fcp: number[],
    fp: number[],
    labels: string[],
}

export class EntriesChartReporter extends AbstractReporter<HTMLCanvasElement, IChartOptions>{

    type: 'chart' = 'chart';
    name: string = 'entries';

    render(container: HTMLCanvasElement, data: IPerformanceResult, _: IUtils, defaultOptions?: any): void {
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
                        borderColor: '#3f681C',
                        borderWidth: 2,
                        backgroundColor: this._utils.colors.transparent,
                    },
                    {
                        label: "First Paint",
                        data: viewData.fp,
                        borderColor: '#FFBB00',
                        borderWidth: 2,
                        backgroundColor: this._utils.colors.transparent,
                    }
                ]
            },
            options: {
                ...defaultOptions,
                tooltips: {
                    callbacks: {
                        afterBody: this.renderComment(comments),
                        label: MsChart.diffLabel(this._utils.formatters.toMs)
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

        const chartData = { fcp: [], fp: [], labels: [], } as ChartData;

        return rawData.reduce((acc, v, i) => {
            const fcpEvent = v.performanceEntries.find(x => x.name === 'first-contentful-paint');
            acc.fcp.push(fcpEvent ? fcpEvent.startTime : 0);

            const fpEvent = v.performanceEntries.find(x => x.name === 'first-paint');
            acc.fp.push(fpEvent ? fpEvent.startTime : 0);

            acc.labels.push(`#${i + 1}`);

            return acc;
        }, chartData);
    }
}