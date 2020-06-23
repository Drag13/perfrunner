import { AbstractChart, IViewData } from './abstract.chart';
import { initWithEmptyString, init0, color } from '../../utils';
import { IPerformanceResult } from './types';

type ChartData = Record<string, any[]>;

export class MarksChartReporter extends AbstractChart<ChartData> {
    readonly name = 'marks';
    readonly type: 'chart' = 'chart';
    readonly title = 'Performance Marks';

    protected getViewData = (rawData: IPerformanceResult) => {
        if (!Array.isArray(rawData)) {
            throw new Error('data is not in array format');
        }

        const length = rawData.length;
        const result: IViewData<ChartData> = { labels: initWithEmptyString(length), runParams: this.runParams(rawData), data: {} };

        return rawData.reduce((acc, v, i) => {
            const marks = v.performanceEntries.filter((x) => x.entryType === 'mark');

            marks.forEach((m) => {
                const name = m.name;
                const startTime = m.startTime;

                if (acc.data[name] == null) {
                    acc.data[name] = init0(length);
                }

                acc.data[name][i] = startTime;
            });

            acc.labels[i] = this.getLabel(i, rawData[i].comment);

            return acc;
        }, result);
    };

    protected getDatasetEntries = (viewData: ChartData) => {
        return Object.entries(viewData).map(([key, entries], i) => this.withDefaults(key, entries, color(i)));
    };
}
