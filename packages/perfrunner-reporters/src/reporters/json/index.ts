import { IReporter, ReportGenerator } from '../iReporter';

const toJson: ReportGenerator = (result) => {
    return Promise.resolve(JSON.stringify(result, null, ' '));
};

export const defaultJSONReporter: IReporter = {
    defaultReportName: 'default-reporter.json',
    generateReport: toJson,
};
