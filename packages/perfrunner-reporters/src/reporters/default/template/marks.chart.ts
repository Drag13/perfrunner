import Chart from 'chart.js';
import { AbstractChart, MsChart } from './abstract-chart';
import { IPerformanceResult } from './types';
import { PArr } from '../../../../utils';
import { toMs, color, TRANSPARENT } from '../../../utils';

type ChartData = Record<string, any[]>;

export class CustomMarksChartReporter extends AbstractChart {
    readonly name = 'marks';
    readonly type: 'chart' = 'chart';

    render(container: HTMLElement, data: IPerformanceResult): void {
        const ctx = this.getSafeCanvasContext(container);

        const viewData = this.transform(data);
        const datasets = this.toDataSet(viewData);
        const comments = this.getComments(data);

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: viewData.labels,
                datasets,
            },
            options: {
                ...this.DEFAULT_CHART_OPTIONS,
                tooltips: {
                    callbacks: {
                        label: MsChart.diffLabel(toMs),
                        afterBody: this.renderComment(comments),
                    },
                },
                title: {
                    display: true,
                    text: 'Performance Marks',
                },
            },
        });
    }

    private transform(rawData: IPerformanceResult) {
        if (!Array.isArray(rawData)) {
            throw new Error('data is not in array format');
        }

        const length = rawData.length;
        const result: ChartData = { labels: PArr.init0(length) };

        return rawData.reduce((acc, v, i) => {
            const marks = v.performanceEntries.filter((x) => x.entryType === 'mark');

            marks.forEach((m) => {
                const name = m.name;
                const startTime = m.startTime;

                if (acc[name] == null) {
                    acc[name] = PArr.init0(length);
                }

                acc[name][i] = startTime;
            });

            acc.labels[i] = `#${i + 1}`;

            return acc;
        }, result);
    }

    private toDataSet(viewData: ChartData) {
        return Object.entries(viewData)
            .filter(([key]) => key !== 'labels')
            .map(([key, entries], i) => this.withDefaults(key, entries, color(i)));
    }
}
