import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path'
import { render } from 'mustache';

import { IReporter } from '..';

const getPathTo = (fileName: string) => join(__dirname, '..', fileName);

const defaultReporter: IReporter = async (outputFolder, data, pathToTemplate) => {

    const templatePath = pathToTemplate == null ? `${getPathTo('default.html')}` : pathToTemplate;

    if (!existsSync(templatePath)) {
        throw new Error(`Template not exists on ${templatePath}`);
    }

    const template = readFileSync(templatePath, { encoding: 'utf-8' });

    const result = render(template, { data, payload: JSON.stringify(data) });

    writeFileSync(join(outputFolder, 'default-reporter.html'), result, { encoding: 'utf-8' });
}

const basic: IReporter = (to, data) => defaultReporter(to, data);

export {
    basic
}