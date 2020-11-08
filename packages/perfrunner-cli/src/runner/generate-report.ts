import { IPerformanceResult, logger } from 'perfrunner-core';
import { asyncToArray, iterateAsync } from 'perfrunner-core/dist/utils/async';
import { loadReporter } from './report-loader';

async function generateReport(reporterName: string, outputTo: string, data: IPerformanceResult, args: string[]) {
    const reporter = await loadReporter(reporterName);
    const exitCode = await reporter(outputTo, data, args);

    return exitCode;
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
        iterateAsync(reports, ({ args, data, outputTo, reporterName }) => generateReport(reporterName, outputTo, data, args))
    );

    const withErrors = exitCodes.some((x) => x !== 0);

    logger.log(`Reporting done ${withErrors ? 'with some errors' : 'successfully'}`);

    return !!withErrors;
}
