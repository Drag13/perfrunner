import Chart from 'chart.js';
import { AbstractChart, MsChart } from "./abstract-chart";
import { IPerformanceResult } from './typings';
import { PColor, PFormat } from './utils';
import { PArr } from '../utils';

type ChartData = Record<string, any[]>;

export class CustomMarksChartReporter extends AbstractChart {

    name = 'marks';
    type: 'chart' = 'chart';

    render(container: HTMLElement, data: IPerformanceResult): void {
        const ctx = this.getSafeCanvasContext(container);

        const viewData = this.transform(data);
        const datasets = this.toDataSet(viewData);
        const comments = this.getComments(data);

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: viewData.labels,
                datasets
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
                    text: "Performance Marks"
                }
            }

        });
    }

    private transform(rawData: IPerformanceResult) {
        if (!Array.isArray(rawData)) {
            throw new Error('data is not in array format')
        };

        const length = rawData.length;
        const result: ChartData = { labels: PArr.init0(length) }

        return rawData.reduce((acc, v, i) => {
            const marks = v.performanceEntries.filter(x => x.entryType === 'mark');

            marks.forEach((m) => {
                const name = m.name;
                const startTime = m.startTime;

                if (acc[name] == null) {
                    acc[name] = PArr.init0(length);
                }

                acc[name][i] = startTime;
            });

            acc.labels[i] = new Date(v.timeStamp);

            return acc;
        }, result);
    }

    private toDataSet(viewData: ChartData) {
        return Object.entries(viewData).filter(([key]) => key !== 'labels').map(([key, entries], i) => ({
            label: key,
            data: entries,
            borderColor: PColor.pick(i),
            backgroundColor: PColor.transparent,
            borderWidth: this.DEFAULT_LINE_WIDTH
        }));
    }
}