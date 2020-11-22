import { NetworkSetup, PerfRunnerOptions } from 'perfrunner-core';
import { getOutputPathFromtestName, getOutputPathFromUrl, isNullOrEmpty, loadExternalModule } from '../../utils';
import { JsonConfig, PageSetup } from '../init/json-config';

const map = async (config: JsonConfig, network: NetworkSetup, page: PageSetup, cache: boolean): Promise<PerfRunnerOptions> => ({
    network,
    chromeArgs: config.chromeArgs,
    executablePath: config.executablePath,
    ignoreDefaultArgs: config.ignoreDefaultArgs,
    useCache: cache,
    purge: false,
    reportOnly: config.reportOnly,
    headless: !config.noHeadless,
    throttlingRate: config.throttling,
    runs: config.runs,
    timeout: config.timeout,
    testName: config.testName,
    waitFor: page.waitFor,
    url: page.url,
    afterPageLoaded: isNullOrEmpty(page.onAfterPageLoadedScript) ? undefined : await loadExternalModule(page.onAfterPageLoadedScript),
    output: config.testName
        ? getOutputPathFromtestName(config.output, config.testName)
        : getOutputPathFromUrl(config.output, page.url),
});

export async function mapConfigToPerfOptions(jsonConfig: JsonConfig): Promise<PerfRunnerOptions[]> {
    const testConfig: Promise<PerfRunnerOptions>[] = [];

    const enabledNetwork = jsonConfig.network.filter((x) => x.disabled);

    for (const cache of jsonConfig.cache) {
        for (const page of jsonConfig.page) {
            for (const network of enabledNetwork) {
                testConfig.push(map(jsonConfig, network, page, cache));
            }
        }
    }

    const testSetup = await Promise.all(testConfig);

    return testSetup;
}
