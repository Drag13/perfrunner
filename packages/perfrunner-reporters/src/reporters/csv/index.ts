import { parse } from 'json2csv';
import { IReporter } from '../iReporter';
import { flatten } from './flatter';
import { writeFile } from '../../utils';

const toCsv: IReporter = (outputFolder, data) =>
    new Promise((resolve, reject) => {
        try {
            const csv = parse(flatten(data));
            writeFile(outputFolder, 'default-report.csv', csv);
            resolve();
        } catch (e) {
            reject(e);
        }
    });

export { toCsv };
