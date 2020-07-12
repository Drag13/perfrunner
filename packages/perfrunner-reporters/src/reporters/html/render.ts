import { getReporterRegistry, defaultReporterNames } from './charts';
import { defined } from '../../utils';
import { IPerformanceResult } from 'perfrunner-core';

(function render(navId: string, contentId: string, data: IPerformanceResult[], reporters: string[] = []) {
    const navNode = document.getElementById(navId);
    const contentNode = document.getElementById(contentId);

    if (!navNode || !contentNode) {
        throw new Error(`${navId == null}? 'navElement ${contentId == null} ? 'contentElement not found!`);
    }

    const allReporters = getReporterRegistry();

    const reportersToRender = (reporters.length ? reporters : defaultReporterNames)
        .map((reporterName) => allReporters[reporterName.toLowerCase()])
        .filter(defined);

    data.forEach((performanceResult, groupId) => {
        reportersToRender.forEach((reporter, i) => {
            const canvasNumber = groupId * reportersToRender.length + i;
            reporter.render(document.querySelectorAll('canvas')[canvasNumber], performanceResult);
        });
    });
})('nav-tab', 'nav-tabContent', (window as any).data, (window as any).renderArgs);
