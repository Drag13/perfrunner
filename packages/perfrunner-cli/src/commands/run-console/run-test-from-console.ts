import { mapConfigToPerfOptions } from './mapper';
import { generateReport, runTestSeries } from '../../runner';
import { parseUserInput } from './parser';

export async function runTestsFromConsole(): Promise<number> {
    const args = parseUserInput();
    console.log(JSON.stringify(args));
    const config = mapConfigToPerfOptions(args);
    const result = await runTestSeries(config);

    const outputTo = args.output;
    const [reporterName, ...reporterArgs] = args.reporter;

    return await generateReport(reporterName, outputTo, result, reporterArgs);
}
