import { AbstractChart, MsChart } from './abstract-chart';
import Chart from 'chart.js';
import { IPerformanceResult } from './types';

import { PArr } from '../../../../utils';
import { color, toMs } from '../../../utils';

type ChartData = {
    layoutDuration: number[];
    recalcStyleDuration: number[];
    scriptDuration: number[];
    taskDuration: number[];
    labels: string[];
};

export class MetricsChartReporter extends AbstractChart {
    readonly type: 'chart' = 'chart';
    readonly name: string = 'metrics';

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
                    this.withDefaults('Layout Duration', viewData.layoutDuration, color(0)),
                    this.withDefaults('Recalculation Style Duration', viewData.recalcStyleDuration, color(1)),
                    this.withDefaults('Script Duration', viewData.scriptDuration, color(2)),
                    this.withDefaults('Task duration', viewData.taskDuration, color(3)),
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
                    text: 'Common performance metrics',
                },
            },
        });
    }

    private transform(data: IPerformanceResult): ChartData {
        if (!Array.isArray(data)) {
            throw new Error('data is not in array format');
        }

        const length = data.length;

        const viewData: ChartData = {
            layoutDuration: PArr.init0(length),
            recalcStyleDuration: PArr.init0(length),
            scriptDuration: PArr.init0(length),
            taskDuration: PArr.init0(length),
            labels: PArr.init0(length),
        };

        return data.reduce((acc, v, i) => {
            acc.layoutDuration[i] = v.pageMetrics.LayoutDuration;
            acc.recalcStyleDuration[i] = v.pageMetrics.RecalcStyleDuration;
            acc.scriptDuration[i] = v.pageMetrics.ScriptDuration;
            acc.taskDuration[i] = v.pageMetrics.TaskDuration;
            acc.labels[i] = `#${i + 1}`;

            return acc;
        }, viewData);
    }
}
