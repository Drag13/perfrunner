import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { render } from 'mustache';

import { IReporter } from '../iReporter';
import { IPerformanceResult } from 'perfrunner-core';
import { groupBy, hash, writeFile } from '../../utils';
import { getReporterRegistry, defaultReporterNames } from './charts';

const groupByPerfConditions = (performanceRuns: IPerformanceResult): IPerformanceResult[] =>
    groupBy(
        performanceRuns,
        ({ runParams: { useCache, network, throttlingRate } }) =>
            `${network.downloadThroughput}_${network.uploadThroughput}_${network.latency}_${throttlingRate}_${useCache ? 1 : 0}`
    );

const getPageMetadata = (pageName: string, isActive: boolean) => ({
    pageName,
    contentId: `x_${hash(pageName)}`,
    pageClass: isActive ? 'active' : '',
    tabClass: isActive ? 'active show' : '',
});

const sanitizeJson = (json: string) => json.replace(/'/g, "'");

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
        href: href.length < 43 ? href : href.substr(0, 42),
        pages: groupedData.map((d, i) => getPageMetadata(getTabName(d, i), i === 0)),
        reporters: reporters,
        payload: sanitizeJson(JSON.stringify(groupedData)),
        arguments: sanitizeJson(JSON.stringify(reporters)),
    });

    writeFile(outputFolder, 'default-report.html', result);
    return 0;
};

export { defaultReporter };
