import { runTestSeries } from '../shared/run-series';
import { mapConfigToPerfOptions } from './map-config-params';
import { generateReport } from '../../runner/generate-report';
import { loadConfig } from './config-loader';

export async function runTestFromConfig(pathToFolder, configName): Promise<number> {
    const config = loadConfig(pathToFolder, configName);
    const params = await mapConfigToPerfOptions(config);
    const result = await runTestSeries(params);

    const outputTo = config.output;
    const [reporterName, ...reporterArgs] = config.reporter;

    return await generateReport(reporterName, outputTo, result, reporterArgs);
}
