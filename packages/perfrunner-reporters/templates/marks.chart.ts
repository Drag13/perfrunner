import Chart from 'chart.js';
import { AbstractReporter, MsChart } from "./abstract-reporter";
import { IPerformanceResult, IChartOptions, IUtils } from './typings';

const colors = [
    `#375E97`,
    `#FB6542`,
    `#FFBB00`,
    `#3f681C`,
    `#000000`,
];

type ChartData = Record<string, any[]>;

export class CustomMarksChartReporter extends AbstractReporter<HTMLCanvasElement, IChartOptions> {

    name = 'marks';
    type: 'chart' = 'chart';

    render(container: HTMLElement, data: IPerformanceResult, _: IUtils, defaultOptions?: IChartOptions | undefined): void {
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
                ...defaultOptions,
                tooltips: {
                    callbacks: {
                        afterBody: this.renderComment(comments),
                        label: MsChart.diffLabel(this._utils.formatters.toMs)
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

        const result: ChartData = { labels: [] }

        return rawData.reduce((acc, v, i) => {
            const marks = v.performanceEntries.filter(x => x.entryType === 'mark');

            marks.forEach((m) => {
                const name = m.name;
                const startTime = m.startTime;

                if (acc[name] == null) {
                    acc[name] = new Array(rawData.length).fill(0);
                }

                acc[name][i] = startTime;
            });

            acc.labels.push(`#${i + 1}`);

            return acc;
        }, result);
    }

    private toDataSet(viewData: ChartData) {
        return Object.entries(viewData).filter(([key]) => key !== 'labels').map(([key, entries], i) => ({
            label: key,
            data: entries,
            borderColor: colors[i],
            backgroundColor: this._utils.colors.transparent,
            borderWidth: 2
        }));
    }
}