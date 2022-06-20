import { runTestSeries } from '../../runner';
import { mapConfigToPerfOptions } from './mapper';
import { loadConfig } from './config-loader';
import { generateReportSeries } from '../../runner';
import { runSingleTest } from '../../runner/run-test-series';
import { getConnectionString, Db } from '../../db';
import { Url } from '../../cmd-utility';
import { ConnectionString } from '../../db/connection-string';
import { generateReport } from '../../runner/generate-report';

export async function runTestFromConfig(pathToFolder: string, configName: string): Promise<number> {
    const config = loadConfig(pathToFolder, configName);
    const params = await mapConfigToPerfOptions(config);

    const [reporterName, ...reporterArgs] = config.reporter;
    let isOk = true;
    
    for (let i = 0; i < params.length; i++) {
        const config = params[i];
        const result = await runSingleTest(config, i);
        const url = Url(config.url);
        const outputTo = config.output;
        const connectionString = getConnectionString(outputTo, url, config.testName);
        const db = new Db(connectionString);
        await db.write(result);
        const dataForReport = await db.read(config.url);
        isOk = isOk && !await generateReport(reporterName, outputTo, dataForReport, reporterArgs);
    }

    // const results = (await runTestSeries(params)).map((result, i) => ({
    //     reporterName,
    //     args: reporterArgs,
    //     outputTo: params[i].output,
    //     data: [result], //TODO FIX
    // }));

    // const isOk = await generateReportSeries(results);

    return isOk ? 0 : -1;
}
