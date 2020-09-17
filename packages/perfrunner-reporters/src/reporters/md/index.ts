import { existsSync, readFileSync } from 'fs';
import { render } from 'mustache';
import { join } from 'path';
import { IPerformanceResult } from 'perfrunner-core';
import { IReporter } from '../..';
import { getDomInteractive, getFCP, getLayoutDuration, getLCP, getRecalculateStyleDuration, getScriptDuration, groupBy, writeFile } from '../../utils';

const groupByPerfConditions = (performanceRuns: IPerformanceResult): IPerformanceResult[] =>
    groupBy(
        performanceRuns,
        ({ runParams: { useCache, network, throttlingRate } }) =>
            `${network.downloadThroughput}_${network.uploadThroughput}_${network.latency}_${throttlingRate}_${useCache ? 1 : 0}`
    );

function getTabName(perfResult: IPerformanceResult, i: number) {
    const options = perfResult[0].runParams;
    const networkName = options.network.name ?? `#${i}`;
    const throttling = options.throttlingRate === 0 ? `no throttling` : `throttling: ${options.throttlingRate}`;
    const cache = !!options.useCache ? `with cache` : `no cache`;

    return `${networkName}, ${throttling}, ${cache}`;
}

const getPageMetadata = (data: IPerformanceResult, i: number) => ({
    pageName: getTabName(data, i),
    stats: data.map((x) => ({
        lcp: getLCP(x.performanceEntries),
        fcp: getFCP(x.performanceEntries),
        domInteractive: getDomInteractive(x.performanceEntries),

        scriptDuration: getScriptDuration(x.pageMetrics),
        layoutDuration: getLayoutDuration(x.pageMetrics),
        recalculateStyleDuration: getRecalculateStyleDuration(x.pageMetrics),
    })),
});

export const toSimpleMd: IReporter = (outputFolder, data) => {
    const templatePath = join(__dirname, 'index.md');

    if (!existsSync(templatePath)) {
        return Promise.reject('Template for md reporter not found');
    }

    try {
        const template = readFileSync(templatePath, { encoding: 'utf-8' });
        const href = data[0].runParams.url;
        const groupedData = groupByPerfConditions(data);

        const result = render(template, {
            href: href.length < 43 ? href : href.substr(0, 42),
            pages: groupedData.map((d, i) => getPageMetadata(d, i)),
        });

        writeFile(outputFolder, 'default-report.md', result);
    } catch (e) {
        return Promise.reject(e);
    }
    return Promise.resolve(0);
};
