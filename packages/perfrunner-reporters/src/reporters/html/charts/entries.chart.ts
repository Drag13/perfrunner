import { AbstractChart, IViewData, msLabel } from '../abstract.chart';
import { IPerformanceResult } from '../types';
import { init0, initWithEmptyString, color } from '../../../utils';

type ChartData = { fp: number[]; fcp: number[]; DOMContentLoaded: number[]; DOMInteractive: number[]; load: number[]; lcp: number[] };

export class EntriesChartReporter extends AbstractChart<ChartData> {
    readonly type: 'chart' = 'chart';
    readonly name: string = 'entries';
    readonly title = 'Application Events';
    protected yAxesLabelCalback = msLabel;

    protected getDatasetEntries = (data: ChartData) => {
        return [
            this.withDefaults('First Contentful Paint', data.fcp, color(0)),
            this.withDefaults('First Paint', data.fp, color(1)),
            this.withDefaults('DOM Content Loaded', data.DOMContentLoaded, color(2)),
            this.withDefaults('DOM Interactive', data.DOMInteractive, color(3)),
            this.withDefaults('Largest Contentful Paint', data.lcp, color(4)),
        ];
    };

    protected getViewData = (rawData: IPerformanceResult) => {
        if (!Array.isArray(rawData)) {
            throw new Error('data is not in array format');
        }

        const length = rawData.length;
        const chartData: IViewData<ChartData> = {
            data: {
                fcp: init0(length),
                fp: init0(length),
                load: init0(length), // out of render for now
                DOMContentLoaded: init0(length),
                DOMInteractive: init0(length),
                lcp: init0(length),
            },
            labels: initWithEmptyString(length),
            runParams: this.runParams(rawData),
        };

        return rawData.reduce((acc, v, i) => {
            const fcpEvent = v.performanceEntries.find((x) => x.name === 'first-contentful-paint');
            acc.data.fcp[i] = fcpEvent && fcpEvent.startTime ? fcpEvent.startTime : 0;

            const fpEvent = v.performanceEntries.find((x) => x.name === 'first-paint');
            acc.data.fp[i] = fpEvent && fpEvent.startTime ? fpEvent.startTime : 0;

            const navigationEvent = v.performanceEntries.find((x) => x.entryType === 'navigation');

            if (navigationEvent != null) {
                acc.data.load[i] = navigationEvent.loadEventEnd || 0;
                acc.data.DOMContentLoaded[i] = navigationEvent.domContentLoadedEventEnd || 0;
                acc.data.DOMInteractive[i] = navigationEvent.domInteractive || 0;
            }

            const lcpEvent = v.performanceEntries.find((x) => x.entryType === 'largest-contentful-paint');
            acc.data.lcp[i] = lcpEvent?.renderTime ?? lcpEvent?.loadTime ?? 0;
            acc.labels[i] = this.getLabel(i, rawData[i].comment);

            return acc;
        }, chartData);
    };
}
