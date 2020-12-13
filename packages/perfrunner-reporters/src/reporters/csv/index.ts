import { parse } from 'json2csv';
import { IPerformanceResult } from 'perfrunner-core';
import { IReporter } from '../iReporter';
import { flatten } from './flatter';

const generateCsvRerport = (data: IPerformanceResult) => Promise.resolve(parse(flatten(data)));

export const defaultCSVReporter: IReporter = {
    defaultReportName: 'default-report.csv',
    generateReport: generateCsvRerport,
};
