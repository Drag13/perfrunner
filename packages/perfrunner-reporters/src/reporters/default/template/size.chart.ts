import Chart from 'chart.js';
import { AbstractChart, MsChart } from './abstract-chart';
import { ExtendedPerformanceEntry } from 'perfrunner-core/dist/profiler/browser';
import { color, toBytes, init0, ResourceType, getResourceType } from '../../../utils';
import { IPerformanceResult } from './types';
import { initWithEmptyString } from '../../../utils/array';

type ChartData = { [key in ResourceType]: number[] } & { labels: string[] };

export class ResourceSizeChart extends AbstractChart {
    readonly type: 'chart' = 'chart';
    readonly name: string = 'size';

    render(container: HTMLCanvasElement, data: IPerformanceResult): void {
        const ctx = this.getSafeCanvasContext(container);

        const viewData = this.transform(data);
        const comments = this.getComments(data);
        const runParams = this.getRunParams(data);

        const datasets = [
            this.withDefaults('Total JS Size', viewData.js, color(0)),
            this.withDefaults('Total IMG Size', viewData.img, color(1)),
            this.withDefaults('Total CSS Size', viewData.css, color(2)),
            this.withDefaults('Total Fonts Size', viewData.font, color(3)),
            this.withDefaults('Index.html Size', viewData.document, color(4)),
        ];

        const isOtherResourcesFound = viewData.unknown.some((x) => x > 0);

        if (isOtherResourcesFound) {
            datasets.push(this.withDefaults('Others', viewData.unknown, color(5)));
        }

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
                        label: MsChart.diffLabel(toBytes),
                        footer: this.renderRunParams(runParams),
                    },
                },
                title: {
                    display: true,
                    text: 'Resource Size',
                },
                scales: {
                    yAxes: [
                        {
                            ticks: {
                                beginAtZero: true,
                                callback: (xValue) => (typeof xValue === 'number' ? toBytes(xValue) : toBytes(parseFloat(xValue))),
                            },
                        },
                    ],
                },
            },
        });
    }

    // protected filter(rawData: ExtendedPerformanceEntry[]): ExtendedPerformanceEntry[] { TODO: I want to see only events vefore FCP. Create new Reporter and move it there
    //     if (!Array.isArray(rawData)) { throw new Error('data is not in array format') };

    //     const firstPaintEvent = rawData.find(x => x.name === 'first-contentful-paint') ?? rawData.find(x => x.name === 'first-paint');
    //     const fpeTime = firstPaintEvent?.startTime ?? Number.POSITIVE_INFINITY;

    //     return rawData.filter(x => x.name != null && (x.responseEnd || x.responseEnd < fpeTime));
    // }

    protected filter(rawData: ExtendedPerformanceEntry[]): ExtendedPerformanceEntry[] {
        if (!Array.isArray(rawData)) {
            throw new Error('data is not in array format');
        }

        return rawData.filter((x) => x.name != null && x.name != '');
    }

    private transform(rawData: IPerformanceResult): ChartData {
        if (!Array.isArray(rawData)) {
            throw new Error('data is not in array format');
        }

        const length = rawData.length;
        const newArray = () => init0(length);

        const data: ChartData = {
            css: newArray(),
            img: newArray(),
            js: newArray(),
            unknown: newArray(),
            document: newArray(),
            font: newArray(),
            xhr: newArray(),
            labels: initWithEmptyString(length),
        };

        const performanceEntries = rawData.map((x) => x.performanceEntries).filter(this.filter); // TODO: filter first

        const datasets = performanceEntries.reduce((acc, entrySet, i) => {
            entrySet.forEach((pEntry) => {
                const entryType = getResourceType(pEntry);
                acc[entryType][i] += pEntry.encodedBodySize ?? 0;
            });
            acc.labels[i] = this.getLabel(i, rawData[i].comment);
            return acc;
        }, data);

        return datasets;
    }
}
