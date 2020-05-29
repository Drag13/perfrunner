import { EntriesChartReporter } from "./entries.chart";
import { CustomMarksChartReporter } from './marks.chart';
import { MetricsChartReporter } from './metrics.chart';
import { AbstractReporter } from './base-plugin';

const utils = {
    colors: {
        transparent: 'rgba(0, 0, 0, 0.0)'
    }
}

const allReporters = [new EntriesChartReporter(utils), new CustomMarksChartReporter(utils), new MetricsChartReporter(utils)];

const splitBy = <T>(arr: T[], min: number): T[][] => {

    const res = [];
    while (arr.length > 0) {
        res.push(arr.splice(0, min));
    }

    return res;
}

const notUndefined = <T>(x: T | undefined): x is T => x !== undefined;

const defaultChartOptions: IChartOptions = {
    animation: { duration: 0 },
    hover: { animationDuration: 0 },
    responsiveAnimationDuration: 0,
    elements: { line: { tension: 0 } },
    scales: {
        yAxes: [{ ticks: { beginAtZero: true } }]
    }
}

function renderChartRow(parent: Node, charts: AbstractReporter<any, any>[]) {
    const canvases: { canvas: HTMLCanvasElement, chart: AbstractReporter<any, any> }[] = []

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

function renderCharts(root: Node, charts: AbstractReporter<any, any>[], data: IPerformanceResult) {
    const maxChartsInRow = 3;
    splitBy(charts, maxChartsInRow)
        .map(chartGroup => renderChartRow(root, chartGroup))
        .forEach(charts =>
            charts.forEach(({ canvas, chart }) => chart.render(canvas, data, utils, defaultChartOptions)))
}

(function render(root: string, reporters: string[], data: IPerformanceResult) {
    const rootNode = document.getElementById(root);

    if (!rootNode) {
        throw new Error(`Report rendering failed, root node: "${root}" not found`);
    }

    const plugins = reporters.map(pluginName => allReporters.find(pl => pl.name === pluginName)).filter(notUndefined);

    renderCharts(rootNode, plugins.filter(x => x.type === 'chart'), data);
}('root', ['entries', 'marks', 'metrics'], (window as any).data));

