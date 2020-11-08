import { IPerformanceResult, logger } from 'perfrunner-core';
import { asyncToArray, iterateAsync } from 'perfrunner-core/dist/utils/async';
import { loadReporter } from './report-loader';

async function generateReport(reporterName: string, outputTo: string, data: IPerformanceResult, args: string[]) {
    const reporter = await loadReporter(reporterName);
    logger.log('generating report');
    const exitCode = await reporter(outputTo, data, args);

    logger.log(`To view results, please check: ${outputTo}`);

    return exitCode;
}

type ReportResult = {
    reporterName: string;
    outputTo: string;
    data: IPerformanceResult;
    args: string[];
};

export async function generateReportSeries(reports: ReportResult[]) {
    const exitCodes = await asyncToArray(
        iterateAsync(reports, ({ args, data, outputTo, reporterName }) => generateReport(reporterName, outputTo, data, args))
    );

    return exitCodes;
}
