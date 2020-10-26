import { logger } from 'perfrunner-core';
import { loadReporter } from './report-loader';

export async function generateReport(name: string, outputTo: string, data: any, args: string[]) {
    const reporter = await loadReporter(name);
    logger.log('generating report');
    const exitCode = await reporter(outputTo, data, args);

    logger.log(`To view results, please check: ${outputTo}`);

    return exitCode;
}
