import { AbstractChart, IViewData, diffLabel, kbLabel } from './abstract.chart';
import { ResourceType, isNullOrEmpty, color, toBytes, init0, initWithEmptyString, getResourceType } from '../../../utils';
import { ExtendedPerformanceEntry } from 'perfrunner-core';
import { IPerformanceResult } from '../types';

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
                html: newArray(),
            },
            labels: initWithEmptyString(length),
            runParams: this.runParams(rawData),
            timeStamp: init0(length),
        };

        const performanceEntries = rawData.map((x) => this.filter(x.performanceEntries));

        return performanceEntries.reduce((acc, entrySet, i) => {
            entrySet.forEach((pEntry) => {
                const entryType = getResourceType(pEntry);
                acc.data[entryType][i] += pEntry.encodedBodySize || 0;
            });
            acc.labels[i] = this.getLabel(i, rawData[i].comment);
            acc.timeStamp[i] = rawData[i].timeStamp;
            return acc;
        }, data);
    };

    protected getDatasetEntries = (viewData: ChartData) => {
        const isEmpty = (arr: number[]) => arr.reduce((sum, val) => sum + val, 0) === 0;
        const datasets = [
            !isEmpty(viewData.js) ? this.withDefaults('JS Size', viewData.js, color(0)) : null,
            !isEmpty(viewData.img) ? this.withDefaults('IMG Size', viewData.img, color(1)) : null,
            !isEmpty(viewData.css) ? this.withDefaults('CSS Size', viewData.css, color(2)) : null,
            !isEmpty(viewData.font) ? this.withDefaults('Fonts Size', viewData.font, color(3)) : null,
            !isEmpty(viewData.document) ? this.withDefaults('Index Size', viewData.document, color(4)) : null,
            !isEmpty(viewData.html) ? this.withDefaults('HTML Size', viewData.html, color(5)) : null,
        ].filter((x) => !!x);

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

        return rawData.filter((x) => !isNullOrEmpty(x.name));
    }

    yAxesLabelCalback = kbLabel;
    tooltipLabel = () => diffLabel(toBytes);
}
