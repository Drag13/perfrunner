import Chart from 'chart.js';
import { AbstractChart, MsChart } from './abstract-chart';
import { IPerformanceResult } from './typings';
import { PArr } from '../utils';
import { PColor, PFormat } from './utils';

const imgageFormats = ['.png', '.jpg', '.jpeg', '.tiff', '.webp', 'gif', 'svg'];
const fontFormats = ['.woff', '.woff2', '.ttf', '.otf'];

type ChartData = {
    jsSize: number[];
    imgSize: number[];
    cssSize: number[];
    fontSize: number[];
    indexSize: number[];
    labels: string[];
}

export class ResourceSizeChart extends AbstractChart {
    type: 'chart' = 'chart'

    name: string = 'resource-size'

    render(container: HTMLCanvasElement, data: import("./typings").IPerformanceResult): void {
        const ctx = this.getSafeCanvasContext(container);

        const viewData = this.transform(data);
        const comments = this.getComments(data);

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: viewData.labels,
                datasets: [
                    this.withDefaults('Total JS Size', viewData.jsSize, PColor.pick(0)),
                    this.withDefaults('Total IMG Size', viewData.imgSize, PColor.pick(1)),
                    this.withDefaults('Total CSS Size', viewData.cssSize, PColor.pick(2)),
                    this.withDefaults('Total Fonts Size', viewData.fontSize, PColor.pick(3)),
                    this.withDefaults('Index.html Size', viewData.indexSize, PColor.pick(4)),
                ]
            },
            options: {
                ...this.DEFAULT_CHART_OPTIONS,
                tooltips: {
                    callbacks: {
                        label: MsChart.diffLabel(PFormat.toBytes),
                        afterBody: this.renderComment(comments),
                    }
                },
                title: {
                    display: true,
                    text: "Resource Size"
                }
            }
        });
    }

    private transform(rawData: IPerformanceResult): ChartData {
        if (!Array.isArray(rawData)) { throw new Error('data is not in array format') };
        const length = rawData.length;

        const data: ChartData = {
            imgSize: PArr.init0(length),
            jsSize: PArr.init0(length),
            cssSize: PArr.init0(length),
            fontSize: PArr.init0(length),
            indexSize: PArr.init0(length),

            labels: PArr.init0(length),
        }

        return rawData.reduce((acc, v, i) => {

            let imgSize = 0;
            let jsSize = 0;
            let cssSize = 0;
            let fontSize = 0;

            v.performanceEntries.forEach((x) => {
                if (x.entryType !== 'resource' || !x.name) { return; }

                const pathname = new URL(x.name).pathname?.toLowerCase();

                if (pathname) {

                    const isImage = PArr.includes(imgageFormats, (format) => pathname.endsWith(format));

                    if (isImage) {
                        imgSize += x.encodedBodySize ?? 0;
                        return;
                    }

                    const isJs = pathname.endsWith('.js');

                    if (isJs) {
                        jsSize += x.encodedBodySize ?? 0;
                        return;
                    }

                    const isCss = pathname.endsWith('.css');

                    if (isCss) {
                        cssSize += x.encodedBodySize ?? 0;
                        return;
                    }
                    const isFont = PArr.includes(fontFormats, (format) => pathname.endsWith(format));

                    if (isFont) {
                        fontSize += x.encodedBodySize ?? 0;
                        return;
                    }

                    console.warn(`unknown resource: ${pathname}`);
                }
            });

            acc.imgSize[i] = imgSize;
            acc.jsSize[i] = jsSize;
            acc.cssSize[i] = cssSize;
            acc.fontSize[i] = fontSize;
            acc.indexSize[i] = v.performanceEntries.find(x => x.entryType === 'navigation')?.encodedBodySize;

            acc.labels[i] = `#${i + 1}`;

            return acc;

        }, data);
    }

}