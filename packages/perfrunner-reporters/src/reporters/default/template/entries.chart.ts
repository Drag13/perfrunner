import Chart from 'chart.js';
import { AbstractChart, MsChart } from './abstract-chart';
import { IPerformanceResult } from './types';
import { color, toMs, init0, initWithEmptyString } from '../../../utils';

type ChartData = {
    fp: number[];
    fcp: number[];
    DOMContentLoaded: number[];
    DOMInteractive: number[];
    load: number[];
    labels: string[];
};

export class EntriesChartReporter extends AbstractChart {
    type: 'chart' = 'chart';
    name: string = 'entries';

    render(container: HTMLCanvasElement, data: IPerformanceResult): void {
        const ctx = this.getSafeCanvasContext(container);

        const viewData = this.transform(data);
        const comments = this.getComments(data);
        const runParams = this.getRunParams(data);

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: viewData.labels,
                datasets: [
                    this.withDefaults('First Contentful Paint', viewData.fcp, color(0)),
                    this.withDefaults('First Paint', viewData.fp, color(1)),
                    this.withDefaults('DOM Content Loaded', viewData.DOMContentLoaded, color(2)),
                    this.withDefaults('DOM Interactive', viewData.DOMInteractive, color(3)),
                ],
            },
            options: {
                ...this.DEFAULT_CHART_OPTIONS,
                tooltips: {
                    callbacks: {
                        label: MsChart.diffLabel(toMs),
                        afterBody: this.renderComment(comments),
                        footer: this.renderRunParams(runParams),
                    },
                },
                title: {
                    display: true,
                    text: 'Application Events',
                },
            },
        });
    }

    private transform(rawData: IPerformanceResult): ChartData {
        if (!Array.isArray(rawData)) {
            throw new Error('data is not in array format');
        }

        const length = rawData.length;
        const chartData: ChartData = {
            fcp: init0(length),
            fp: init0(length),
            load: init0(length), // out of render for now
            DOMContentLoaded: init0(length),
            DOMInteractive: init0(length),
            labels: initWithEmptyString(length),
        };

        return rawData.reduce((acc, v, i) => {
            const fcpEvent = v.performanceEntries.find((x) => x.name === 'first-contentful-paint');
            acc.fcp[i] = fcpEvent && fcpEvent.startTime ? fcpEvent.startTime : 0;

            const fpEvent = v.performanceEntries.find((x) => x.name === 'first-paint');
            acc.fp[i] = fpEvent && fpEvent.startTime ? fpEvent.startTime : 0;

            const navigationEvent = v.performanceEntries.find((x) => x.entryType === 'navigation');

            acc.load[i] = navigationEvent.loadEventEnd || 0;
            acc.DOMContentLoaded[i] = navigationEvent.domContentLoadedEventEnd || 0;
            acc.DOMInteractive[i] = navigationEvent.domInteractive || 0;

            acc.labels[i] = `#${i + 1}`;

            return acc;
        }, chartData);
    }
}
