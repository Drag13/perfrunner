import { join } from 'path';
import { IPerformanceResult, logger } from 'perfrunner-core';
import { asyncToArray, iterateAsync } from 'perfrunner-core/dist/utils/async';
import { writeFile } from '../utils';
import { loadReporter } from './report-loader';

async function generateReport(reporterName: string, outputTo: string, data: IPerformanceResult, args: string[]) {
    const { defaultReportName = 'reporter.txt', generateReport } = await loadReporter(reporterName);

    try {
        const result = await generateReport(data, args);
        const fullPath = join(outputTo, defaultReportName);
        writeFile(fullPath as any, result);
    } catch (error) {
        logger.error(error);
        throw error;
    }

    return 0;
}

type ReportResult = {
    reporterName: string;
    outputTo: string;
    data: IPerformanceResult;
    args: string[];
};

export async function generateReportSeries(reports: ReportResult[]): Promise<boolean> {
    logger.log('generating report');

    const exitCodes = await asyncToArray(
        iterateAsync(reports, async ({ args, data, outputTo, reporterName }) => {
            return await generateReport(reporterName, outputTo, data, args);
        })
    );

    const withErrors = exitCodes.some((x) => x !== 0);

    logger.log(`reporting done ${withErrors ? 'with some errors' : 'successfully'}`);

    return !!withErrors;
}
