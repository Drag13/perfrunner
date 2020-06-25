import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { render } from 'mustache';

import { IReporter } from '../iReporter';

const defaultReporter: IReporter = async (outputFolder, data, args) => {
    const templatePath = join(__dirname, 'index.html');

    if (!existsSync(templatePath)) {
        throw new Error(`Template not exists on ${templatePath}`);
    }

    const template = readFileSync(templatePath, { encoding: 'utf-8' });
    const result = render(template, { data, payload: JSON.stringify(data), arguments: JSON.stringify(args) });

    writeFileSync(join(outputFolder, 'default-report.html'), result, { encoding: 'utf-8' });
};

export { defaultReporter };
