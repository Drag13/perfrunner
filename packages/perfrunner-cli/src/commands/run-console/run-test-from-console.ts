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

    const isOk = await generateReportSeries(results);

    return isOk ? 0 : -1;
}
