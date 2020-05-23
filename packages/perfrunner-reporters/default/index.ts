import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path'
import { html } from "web-resource-inliner";

import { IReporter } from '..';
import { render } from 'mustache';

const getPathTo = (fileName: string) => join(__dirname, '..', 'templates', fileName);

const pack = async (template: string): Promise<string> => {
    return new Promise((res, rej) => {
        html({ fileContent: template, relativeTo: join(__dirname, '..', 'templates')}, (err, result) => err ? rej(err) : res(result));
    });
}

const defaultReporter: IReporter = async (to, data, pathToTemplate) => {

    const templatePath = pathToTemplate == null ? `${getPathTo('default.html')}` : pathToTemplate;

    if (!existsSync(templatePath)) {
        throw new Error(`Template not exists on ${templatePath}`);
    }

    const template = readFileSync(templatePath, { encoding: 'utf-8' });
    const packed =  await pack(template);

    const result = render(packed, { data, payload: JSON.stringify(data) });

    writeFileSync(`${to}/result.html`, result, { encoding: 'utf-8' });
}

const basic: IReporter = (to, data) => defaultReporter(to, data);

export {
    basic
}