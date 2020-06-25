import { parse } from 'json2csv';
import { IReporter } from '../iReporter';
import { writeFile } from '../../utils';

const toCsv: IReporter = (outputFolder, data) =>
    new Promise((resolve, reject) => {
        try {
            const csv = parse(data);
            writeFile(outputFolder, 'default-report.csv', csv);
            resolve();
        } catch (e) {
            reject(e);
        }
    });

export { toCsv };
