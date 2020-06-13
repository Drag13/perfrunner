import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path'
import { render } from 'mustache';

import { IReporter } from '../iReporter';

const defaultReporter: IReporter = async (outputFolder, data, args) => {

    const templatePath = join(__dirname, 'template', 'index.html');

    if (!existsSync(templatePath)) {
        throw new Error(`Template not exists on ${templatePath}`);
    }

    const template = readFileSync(templatePath, { encoding: 'utf-8' });
    const result = render(template, { data, payload: JSON.stringify(data), arguments:  JSON.stringify(args) });

    writeFileSync(join(outputFolder, 'default-reporter.html'), result, { encoding: 'utf-8' });
}

const basic: IReporter = (outputFolder, data, args?: string[]) => defaultReporter(outputFolder, data, args);

export {
    basic
}