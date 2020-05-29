import { AbstractReporter } from './abstract-reporter';
import Chart, { ChartOptions } from 'chart.js';

type ChartData = {
    layoutDuration: number[],
    recalcStyleDuration: number[],
    scriptDuration: number[],
    labels: string[]
}

export class MetricsChartReporter extends AbstractReporter<HTMLCanvasElement, IChartOptions>{
    type: 'chart' = 'chart';
    name: string = 'metrics';

    render(container: HTMLCanvasElement, data: IPerformanceResult, _: IUtils, defaultOptions?: ChartOptions): void {
        const ctx = this.getSafeCanvasContext(container);

        const viewData = this.transform(data);
        const comments = this.getComments(data);

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: viewData.labels,
                datasets: [{
                    label: 'Layout Duration',
                    data: viewData.layoutDuration,
                    borderColor: `#375E97`,
                    backgroundColor: this._utils.colors.transparent,
                    borderWidth: 2
                },
                {
                    label: 'Recalculation Style Duration',
                    data: viewData.recalcStyleDuration,
                    borderColor: `#FB6542`,
                    backgroundColor: this._utils.colors.transparent,
                    borderWidth: 2
                },
                {
                    label: 'Script Duration',
                    data: viewData.scriptDuration,
                    borderColor: `#FFBB00`,
                    backgroundColor: this._utils.colors.transparent,
                    borderWidth: 2
                }
                ]
            },
            options: {
                ...defaultOptions,
                tooltips: {
                    callbacks: {
                        afterBody: this.renderComment(comments)
                    }
                }
            }
        });
    }

    private transform(data: IPerformanceResult): ChartData {

        if (!Array.isArray(data)) {
            throw new Error('data is not in array format')
        };

        const viewData = { layoutDuration: [], recalcStyleDuration: [], scriptDuration: [], labels: [] } as ChartData

        return data.reduce((acc, v, i) => {
            acc.layoutDuration.push(v.pageMetrics.LayoutDuration);
            acc.recalcStyleDuration.push(v.pageMetrics.RecalcStyleDuration);
            acc.scriptDuration.push(v.pageMetrics.ScriptDuration);
            acc.labels.push(`#${i + 1}`);
            return acc;
        }, viewData);
    }
}
