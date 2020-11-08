import { runTestSeries } from '../../runner';
import { mapConfigToPerfOptions } from './mapper';
import { loadConfig } from './config-loader';
import { generateReportSeries } from '../../runner';

export async function runTestFromConfig(pathToFolder: string, configName: string): Promise<number> {
    const config = loadConfig(pathToFolder, configName);
    const params = await mapConfigToPerfOptions(config);

    const [reporterName, ...reporterArgs] = config.reporter;

    const results = (await runTestSeries(params)).map((result, i) => ({
        reporterName,
        args: reporterArgs,
        outputTo: params[i].output,
        data: result,
    }));

    const isOk = await generateReportSeries(results);

    return isOk ? 0 : -1;
}
