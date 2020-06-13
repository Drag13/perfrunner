import { writeFileSync } from 'fs';
import { IReporter } from "../iReporter";
import { join } from 'path';

const toJson: IReporter = (outputFolder, result) => {
    return new Promise((resolve, reject) => {
        try {
            const reportPath = join(outputFolder, 'json-reporter.json')
            writeFileSync(reportPath, JSON.stringify(result, null, ' '), { encoding: 'utf-8' });
            resolve();
        } catch (error) { reject(error); }
    })
}

export { toJson }