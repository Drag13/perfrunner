import { render } from 'mustache';
import { join } from 'path';
import { IPerformanceResult } from 'perfrunner-core';
import { IReporter } from '../..';
import {
    readFileAsync,
    getDomInteractive,
    getFCP,
    getLayoutDuration,
    getLCP,
    getRecalculateStyleDuration,
    getScriptDuration,
    groupBy,
    isAllSame,
} from '../../utils';
import { ReportGenerator } from '../iReporter';
import { createViewModel } from './format';

const groupByPerfConditions = (performanceRuns: IPerformanceResult): IPerformanceResult[] =>
    groupBy(
        performanceRuns,
        ({ runParams: { useCache, network, throttlingRate } }) =>
            `${network.downloadThroughput}_${network.uploadThroughput}_${network.latency}_${throttlingRate}_${useCache ? 1 : 0}`
    );

function getTabName(perfResult: IPerformanceResult) {
    const options = perfResult[0].runParams;
    const networkName =
        options.network.name ??
        `D:"${options.network.downloadThroughput}", U:"${options.network.uploadThroughput}", L:"${options.network.latency}"`;
    const throttling = options.throttlingRate === 0 ? `no throttling` : `throttling: ${options.throttlingRate}`;
    const cache = !!options.useCache ? `with cache` : `no cache`;

    return `${networkName}, ${throttling}, ${cache}`;
}

const getPageMetadata = (data: IPerformanceResult) => ({
    pageName: getTabName(data),
    stats: createViewModel(
        data
            .sort((a, b) => b.timeStamp - a.timeStamp)
            .map((x) => ({
                lcp: getLCP(x.performanceEntries),
                fcp: getFCP(x.performanceEntries),
                domInteractive: getDomInteractive(x.performanceEntries),

                scriptDuration: getScriptDuration(x.pageMetrics),
                layoutDuration: getLayoutDuration(x.pageMetrics),
                recalculateStyleDuration: getRecalculateStyleDuration(x.pageMetrics),
                ts: x.timeStamp,
            }))
    ),
});

const toSimpleMd: ReportGenerator = async (data) => {
    const templatePath = join(__dirname, 'index.md');

    try {
        const template = await readFileAsync(templatePath);
        const href = isAllSame(data.map((x) => x.runParams.url)) ? data[0].runParams.url : 'Various';
        const groupedData = groupByPerfConditions(data);

        const result = render(template, {
            href: href.length < 43 ? href : href.substr(0, 42),
            pages: groupedData.map(getPageMetadata),
        });

        return result;
    } catch (e) {
        return Promise.reject(e);
    }
};

export const defaultMdReporter: IReporter = {
    defaultReportName: 'default-report.md',
    generateReport: toSimpleMd,
};
