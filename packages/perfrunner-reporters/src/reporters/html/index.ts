import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { render } from 'mustache';

import { IReporter } from '../iReporter';
import { IPerformanceResult } from 'perfrunner-core';
import { groupBy, hash } from '../../utils';
import { getReporterRegistry, defaultReporterNames } from './charts';

const groupByPerfConditions = (performanceRuns: IPerformanceResult): IPerformanceResult[] => {
    return groupBy(
        performanceRuns,
        ({ runParams: { useCache, network, throttlingRate } }) =>
            `${network.downloadThroughput}_${network.uploadThroughput}_${network.latency}_${throttlingRate}_${useCache ? 1 : 0}`
    );
};

const pageViewData = (pageName: string, isActive: boolean) => {
    return {
        pageName,
        contentId: `x_${hash(pageName)}`,
        pageClass: isActive ? 'active': '',
        tabClass: isActive ? 'active show': '',
    };
};

const defaultReporter: IReporter = async (outputFolder, data, args) => {
    const templatePath = join(__dirname, 'index.html');

    if (!existsSync(templatePath)) {
        throw new Error(`Template not exists on ${templatePath}`);
    }

    const href = data[0].runParams.url;
    const groupedData = groupByPerfConditions(data);
    const allReporters = getReporterRegistry();
    const reporters = (args?.length ? args : defaultReporterNames).filter((x) => allReporters[x.toLowerCase()]);

    const template = readFileSync(templatePath, { encoding: 'utf-8' });
    const result = render(template, {
        href: href.length < 42 ? href : href.substr(0, 41),
        pages: groupedData.map((_, i) => pageViewData(`Perf conditions #${i}`, i === 0)),
        reporters: reporters,
        payload: JSON.stringify(groupedData),
        arguments: JSON.stringify(reporters),
    });

    writeFileSync(join(outputFolder, 'default-report.html'), result, { encoding: 'utf-8' });
};

export { defaultReporter };
