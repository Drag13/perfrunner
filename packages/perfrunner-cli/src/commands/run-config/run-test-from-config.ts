import { runTestSeries, generateReport } from '../../runner';
import { mapConfigToPerfOptions } from './mapper';
import { loadConfig } from './config-loader';

export async function runTestFromConfig(pathToFolder: string, configName: string): Promise<number> {
    const config = loadConfig(pathToFolder, configName);
    const params = await mapConfigToPerfOptions(config);
    const result = await runTestSeries(params);

    const outputTo = config.output;
    const [reporterName, ...reporterArgs] = config.reporter;

    return await generateReport(reporterName, outputTo, result, reporterArgs);
}
