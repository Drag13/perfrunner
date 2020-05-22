import { readFileSync, writeFileSync, existsSync } from 'fs';
import {  join } from 'path'

import { IReporter } from '..';
import { render } from 'mustache';

const getPathTo = (fileName: string) => join(__dirname, '..','templates', fileName);

const defaultReporter: IReporter = (to, data, pathToTemplate) => {

    const templatePath = pathToTemplate == null ? `${getPathTo('default.html')}` : pathToTemplate;

    if (!existsSync(templatePath)) {
        throw new Error(`Template not exists on ${templatePath}`);
    }

    const template = readFileSync(templatePath, { encoding: 'utf-8' });

    const result = render(template, data);

    writeFileSync(`${to}/result.html`, result, {encoding: 'utf-8'});
}

const basic: IReporter = (to, data) => defaultReporter(to, data);

export {
    basic
}