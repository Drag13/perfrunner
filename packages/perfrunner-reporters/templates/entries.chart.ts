import Chart from 'chart.js';
import { AbstractChart, MsChart } from "./abstract-chart";
import { IPerformanceResult } from './typings';
import { PColor, PFormat } from './utils';
import { PArr } from '../utils';

type ChartData = {
    fcp: number[],
    fp: number[],
    labels: Date[],
}

export class EntriesChartReporter extends AbstractChart{

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
                        borderColor: PColor.pick(0),
                        borderWidth: this.DEFAULT_LINE_WIDTH,
                        backgroundColor: PColor.transparent,
                    },
                    {
                        label: "First Paint",
                        data: viewData.fp,
                        borderColor: PColor.pick(1),
                        borderWidth: this.DEFAULT_LINE_WIDTH,
                        backgroundColor: PColor.transparent,
                    }
                ]
            },
            options: {
                ...this.DEFAULT_CHART_OPTIONS,
                tooltips: {
                    callbacks: {
                        label: MsChart.diffLabel(PFormat.toMs),
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
        const chartData = { fcp: PArr.init0(length), fp: PArr.init0(length), labels: PArr.init0(length), } as ChartData;

        return rawData.reduce((acc, v, i) => {
            const fcpEvent = v.performanceEntries.find(x => x.name === 'first-contentful-paint');
            acc.fcp[i] = (fcpEvent ? fcpEvent.startTime : 0);

            const fpEvent = v.performanceEntries.find(x => x.name === 'first-paint');
            acc.fp[i] = (fpEvent ? fpEvent.startTime : 0);

            acc.labels[i] = new Date(v.timeStamp);

            return acc;
        }, chartData);
    }
}