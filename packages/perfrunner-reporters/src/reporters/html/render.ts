import { getReporterRegistry, defaultReporterNames } from './charts';
import { defined, groupBy } from '../../utils';
import { IPerformanceResult } from 'perfrunner-core';
import { renderPages, renderPlacholdersForCharts } from './renders';

const groupByPerfConditions = (performanceRuns: IPerformanceResult): IPerformanceResult[] => {
    return groupBy(
        performanceRuns,
        ({ runParams: { useCache, network, throttlingRate } }) =>
            `${network.downloadThroughput}_${network.uploadThroughput}_${network.latency}_${throttlingRate}_${useCache ? 1 : 0}`
    );
};

(function render(navId: string, contentId: string, data: IPerformanceResult, reporters: string[] = []) {
    const navNode = document.getElementById(navId);
    const contentNode = document.getElementById(contentId);

    if (!navNode || !contentNode) {
        throw new Error(`${navId == null}? 'navElement ${contentId == null} ? 'contentElement not found!`);
    }

    const allReporters = getReporterRegistry();

    const reportersToRender = (reporters.length ? reporters : defaultReporterNames)
        .map((reporterName) => allReporters[reporterName.toLowerCase()])
        .filter(defined);

    const groupedData = groupByPerfConditions(data);

    renderPages(
        navNode,
        contentNode,
        groupedData.map((_, i) => ({
            tabName: `Perf conditions #${i}`,
            content: renderPlacholdersForCharts(reportersToRender.length),
        }))
    );

    groupedData.forEach((performanceResult, groupId) => {
        reportersToRender.forEach((reporter, i) => {
            const canvasNumber = groupId * reportersToRender.length + i;
            reporter.render(document.querySelectorAll('canvas')[canvasNumber], performanceResult);
        });
    });
})('nav-tab', 'nav-tabContent', (window as any).data, (window as any).renderArgs);
