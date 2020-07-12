import { AbstractChart, IViewData, msLabel } from '../abstract.chart';
import { color, init0, initWithEmptyString } from '../../../utils';
import { IPerformanceResult } from '../types';

type ChartData = {
    layoutDuration: number[];
    recalcStyleDuration: number[];
    scriptDuration: number[];
    taskDuration: number[];
};

export class MetricsChartReporter extends AbstractChart<ChartData> {
    readonly type: 'chart' = 'chart';
    readonly name: string = 'metrics';
    readonly title = 'Common performance metrics';
    yAxesLabelCalback = msLabel;

    protected getViewData = (rawData: IPerformanceResult) => {
        if (!Array.isArray(rawData)) {
            throw new Error('data is not in array format');
        }

        const length = rawData.length;

        const viewData: IViewData<ChartData> = {
            labels: initWithEmptyString(length),
            runParams: this.runParams(rawData),
            data: {
                layoutDuration: init0(length),
                recalcStyleDuration: init0(length),
                scriptDuration: init0(length),
                taskDuration: init0(length),
            },
            timeStamp: init0(length),
        };

        return rawData.reduce((acc, v, i) => {
            acc.data.layoutDuration[i] = v.pageMetrics.LayoutDuration;
            acc.data.recalcStyleDuration[i] = v.pageMetrics.RecalcStyleDuration;
            acc.data.scriptDuration[i] = v.pageMetrics.ScriptDuration;
            acc.data.taskDuration[i] = v.pageMetrics.TaskDuration;
            acc.labels[i] = this.getLabel(i, rawData[i].comment);
            acc.timeStamp[i] = rawData[i].timeStamp;

            return acc;
        }, viewData);
    };

    protected getDatasetEntries = (viewData: ChartData) => {
        return [
            this.withDefaults('Layout Duration', viewData.layoutDuration, color(0)),
            this.withDefaults('Recalculation Style Duration', viewData.recalcStyleDuration, color(1)),
            this.withDefaults('Script Duration', viewData.scriptDuration, color(2)),
            this.withDefaults('Task duration', viewData.taskDuration, color(3)),
        ];
    };
}
