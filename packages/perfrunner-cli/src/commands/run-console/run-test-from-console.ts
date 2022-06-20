import { mapConfigToPerfOptions } from './mapper';
import { runTestSeries } from '../../runner';
import { parseUserInput } from './parser';
import { generateReportSeries } from '../../runner';

export async function runTestsFromConsole(): Promise<number> {
    const args = parseUserInput();
    const config = mapConfigToPerfOptions(args);

    const [reporterName, ...reporterArgs] = args.reporter;
    // const r = [];
    // for await (const result of await runTestSeries(config)) {
    //     console.log(result);
    //     r.push({result, output: config});
    // }

    const results = (await runTestSeries(config)).map((result, i) => ({
        reporterName,
        args: reporterArgs,
        outputTo: config[i].output,
        data: [result], //FIX THAT
    }));

    // const results = {
    //     reporterName,
    //     args: reporterArgs,
    //     data: r
    // };

    const isOk = await generateReportSeries(results);

    return isOk ? 0 : -1;
}
