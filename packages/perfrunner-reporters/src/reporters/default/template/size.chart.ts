import Chart from 'chart.js';
import { AbstractChart, MsChart } from './abstract-chart';
import { ExtendedPerformanceEntry } from 'perfrunner-core/dist/profiler/browser';
import { color, toBytes, init0 } from '../../../utils';
import { IPerformanceResult } from './types';

type ChartData = { [key in ResourceType | 'labels']: number[] };

type PathName = string;

const getPathName = (url: string): PathName => {
    try {
        const u = new URL(url);
        return u.pathname.toLowerCase();
    } catch (e) {
        console.warn(`invalid url: ${url}`, e);
        console.warn(e);
        return '';
    }
};

interface isResource {
    (pathName: PathName, mimeType?: string): boolean;
}

const isType = (formats: string[], mimeTypes: string[]): isResource => (pathName, mimeType?) =>
    formats.some((type) => pathName.endsWith(type)) || mimeTypes.includes(mimeType);

const cssFormats = ['.css'];
const cssMimeTypes = ['text/css'];
const isCss = isType(cssFormats, cssMimeTypes);

const jsMimeTypes = ['application/javascript', 'text/javascript'];
const jsFormats = ['.js'];
const isJs = isType(jsFormats, jsMimeTypes);

const imgFormats = ['.png', '.jpg', '.jpeg', '.tiff', '.webp', 'gif', 'svg'];
const imgMimeTypes = ['image/gif', 'image/png', 'image/jpeg']; // should be extended
const isImg = isType(imgFormats, imgMimeTypes);

const xhrFormats = [];
const xhrMimeType = ['application/json'];
const isXhr = isType(xhrFormats, xhrMimeType);

const fontFormats = ['.woff', '.woff2', '.ttf', '.otf'];
const fontMimeTypes = []; // should be extended
const isFont = isType(fontFormats, fontMimeTypes);

type ResourceType = 'js' | 'img' | 'css' | 'xhr' | 'font' | 'document' | 'unknown';

const getResourceType = (pEntry: ExtendedPerformanceEntry): ResourceType => {
    if (pEntry.entryType === 'navigation') {
        return 'document';
    }

    if (pEntry.entryType === 'resource') {
        const pathName = getPathName(pEntry.name);
        const mimeType = pEntry.extension?.mimeType;

        if (isJs(pathName, mimeType)) {
            return 'js';
        }

        if (isCss(pathName, mimeType)) {
            return 'css';
        }

        if (isImg(pathName, mimeType)) {
            return 'img';
        }

        if (isXhr(pathName, mimeType)) {
            return 'xhr';
        }

        if (isFont(pathName, mimeType)) {
            return 'font';
        }
    }

    return 'unknown';
};

export class ResourceSizeChart extends AbstractChart {
    readonly type: 'chart' = 'chart';
    readonly name: string = 'size';

    render(container: HTMLCanvasElement, data: IPerformanceResult): void {
        const ctx = this.getSafeCanvasContext(container);

        const viewData = this.transform(data);
        const comments = this.getComments(data);
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
                        afterBody: this.renderComment(comments),
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
            labels: newArray(),
            document: newArray(),
            font: newArray(),
            xhr: newArray(),
        };

        const performanceEntries = rawData.map((x) => x.performanceEntries).filter(this.filter); // TODO: filter first

        const datasets = performanceEntries.reduce((acc, entrySet, i) => {
            entrySet.forEach((pEntry) => {
                const entryType = getResourceType(pEntry);
                acc[entryType][i] += pEntry.encodedBodySize ?? 0;
            });

            return acc;
        }, data);

        return datasets;
    }
}
