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

const getPageMetadata = (pageName: string, isActive: boolean) => {
    return {
        pageName,
        contentId: `x_${hash(pageName)}`,
        pageClass: isActive ? 'active' : '',
        tabClass: isActive ? 'active show' : '',
    };
};

function getTabName(perfResult: IPerformanceResult, i: number) {
    const options = perfResult[0].runParams;
    const networkName = options.network.name ?? `#${i}`;
    const throttling = options.throttlingRate === 0 ? `no throttling` : `throttling: ${options.throttlingRate}`;
    const cache = !!options.useCache ? `with cache` : `no cache`;

    return `${networkName}, ${throttling}, ${cache}`;
}

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
        pages: groupedData.map((d, i) => getPageMetadata(getTabName(d, i), i === 0)),
        reporters: reporters,
        payload: JSON.stringify(groupedData),
        arguments: JSON.stringify(reporters),
    });

    writeFileSync(join(outputFolder, 'default-report.html'), result, { encoding: 'utf-8' });
};

export { defaultReporter };
