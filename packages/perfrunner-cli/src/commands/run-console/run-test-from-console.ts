import { mapConfigToPerfOptions } from './mapper';
import { runTestSeries } from '../../runner';
import { parseUserInput } from './parser';
import { generateReportSeries } from '../../runner';

export async function runTestsFromConsole(): Promise<number> {
    const args = parseUserInput();
    const config = mapConfigToPerfOptions(args);

    const [reporterName, ...reporterArgs] = args.reporter;

    const results = (await runTestSeries(config)).map((result, i) => ({
        reporterName,
        args: reporterArgs,
        outputTo: config[i].output,
        data: result,
    }));

    const reporterResults = await generateReportSeries(results);

    return reporterResults.some((x) => x !== 0) ? -1 : 0;
}
