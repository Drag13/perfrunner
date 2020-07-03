import { AbstractChart, IViewData, diffLabel, kbLabel } from './abstract.chart';
import { ResourceType, isNullOrEmpty, color, toBytes, init0, initWithEmptyString, getResourceType } from '../../utils';
import { ExtendedPerformanceEntry } from 'perfrunner-core';
import { IPerformanceResult } from './types';

type ChartData = { [key in ResourceType]: number[] };

export class ResourceSizeChart extends AbstractChart<ChartData> {
    readonly type: 'chart' = 'chart';
    readonly name: string = 'size';
    readonly title: string = 'Resource Size';

    protected getViewData = (rawData: IPerformanceResult) => {
        if (!Array.isArray(rawData)) {
            throw new Error('data is not in array format');
        }

        const length = rawData.length;
        const newArray = () => init0(length);

        const data: IViewData<ChartData> = {
            data: {
                css: newArray(),
                img: newArray(),
                js: newArray(),
                unknown: newArray(),
                document: newArray(),
                font: newArray(),
                xhr: newArray(),
            },
            labels: initWithEmptyString(length),
            runParams: this.runParams(rawData),
        };

        const performanceEntries = rawData.map((x) => x.performanceEntries).filter(this.filter); // TODO: filter first

        return performanceEntries.reduce((acc, entrySet, i) => {
            entrySet.forEach((pEntry) => {
                const entryType = getResourceType(pEntry);
                acc.data[entryType][i] += pEntry.encodedBodySize ?? 0;
            });
            acc.labels[i] = this.getLabel(i, rawData[i].comment);
            return acc;
        }, data);
    };

    protected getDatasetEntries = (viewData: ChartData) => {
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

        return datasets;
    };

    protected filter(rawData: ExtendedPerformanceEntry[]): ExtendedPerformanceEntry[] {
        if (!Array.isArray(rawData)) {
            throw new Error('data is not in array format');
        }

        return rawData.filter((x) => isNullOrEmpty(x.name));
    }

    yAxesLabelCalback = kbLabel;
    tooltipLabel = () => diffLabel(toBytes);
}
