import { EntriesChartReporter } from "./entries.chart";
import { CustomMarksChartReporter } from './marks.chart';
import { MetricsChartReporter } from './metrics.chart';
import { IPerformanceResult, IReporter } from './typings';
import { PArr } from '../utils';
import { ResourceSizeChart } from './size.chart';

const allReporters = [new EntriesChartReporter(), new CustomMarksChartReporter(), new MetricsChartReporter(), new ResourceSizeChart()];

const notUndefined = <T>(x: T | undefined): x is T => x !== undefined;

function renderChartRow(parent: Node, charts: IReporter<HTMLElement>[]) {
    const canvases: { canvas: HTMLCanvasElement, chart: IReporter<HTMLElement> }[] = []

    const row = document.createElement(`div`);
    row.className = 'charts';

    const maxWidth = `${100 / charts.length}%`;

    charts.forEach(chart => {
        const container = document.createElement('div');
        container.className = `chart-container`;
        container.style.maxWidth = maxWidth
        const canvas = document.createElement('canvas');
        container.appendChild(canvas);
        row.append(container);
        canvases.push({ canvas, chart });
    });

    parent.appendChild(row);

    return canvases
}

function renderCharts(root: Node, charts: IReporter<HTMLElement>[], data: IPerformanceResult) {
    const maxChartsInRow = 3;

    PArr.splitBy(charts, maxChartsInRow)
        .map(chartGroup => renderChartRow(root, chartGroup))
        .forEach(charts =>
            charts.forEach(({ canvas, chart }) => chart.render(canvas, data)))
}

(function render(root: string, reporters: string[], data: IPerformanceResult) {
    const rootNode = document.getElementById(root);

    if (!rootNode) {
        throw new Error(`Report rendering failed, root node: "${root}" not found`);
    }

    const plugins = reporters.map(pluginName => allReporters.find(pl => pl.name === pluginName)).filter(notUndefined);

    renderCharts(rootNode, plugins.filter(x => x.type === 'chart'), data);
}('root', ['entries', 'marks', 'metrics', 'resource-size'], (window as any).data));

