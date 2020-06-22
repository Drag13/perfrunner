import Chart from 'chart.js';
import { AbstractChart, MsChart } from './abstract-chart';
import { IPerformanceResult } from './types';
import { toMs, color, init0 } from '../../../utils';
import { initWithEmptyString } from '../../../utils/array';

type ChartData = Record<string, any[]>;

export class CustomMarksChartReporter extends AbstractChart {
    readonly name = 'marks';
    readonly type: 'chart' = 'chart';
    readonly title = 'Performance Marks';

    render(container: HTMLElement, data: IPerformanceResult): void {
        const ctx = this.getSafeCanvasContext(container);

        const viewData = this.transform(data);
        const datasets = this.toDataSet(viewData);
        const runParams = this.getRunParams(data);

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: viewData.labels,
                datasets,
            },
            options: {
                ...this.getDefaultChartOptions(),
                tooltips: {
                    callbacks: {
                        label: MsChart.diffLabel(toMs),
                        footer: this.renderRunParams(runParams),
                    },
                },
            },
        });
    }

    private transform(rawData: IPerformanceResult) {
        if (!Array.isArray(rawData)) {
            throw new Error('data is not in array format');
        }

        const length = rawData.length;
        const result: ChartData = { labels: initWithEmptyString(length) };

        return rawData.reduce((acc, v, i) => {
            const marks = v.performanceEntries.filter((x) => x.entryType === 'mark');

            marks.forEach((m) => {
                const name = m.name;
                const startTime = m.startTime;

                if (acc[name] == null) {
                    acc[name] = init0(length);
                }

                acc[name][i] = startTime;
            });

            acc.labels[i] = this.getLabel(i, rawData[i].comment);

            return acc;
        }, result);
    }

    private toDataSet(viewData: ChartData) {
        return Object.entries(viewData)
            .filter(([key]) => key !== 'labels')
            .map(([key, entries], i) => this.withDefaults(key, entries, color(i)));
    }
}
