import { mapConfigToPerfOptions } from './map-config-params';
import { runTestSeries } from '../shared/run-series';
import { parseUserInput } from './parser/parse-console-args';
import { generateReport } from '../../runner/generate-report';

export async function runTestsFromConsole(): Promise<number> {
    const args = parseUserInput();
    const config = mapConfigToPerfOptions(args);
    const result = await runTestSeries(config);

    const outputTo = args.output;
    const [reporterName, ...reporterArgs] = args.reporter;

    return await generateReport(reporterName, outputTo, result, reporterArgs);
}
