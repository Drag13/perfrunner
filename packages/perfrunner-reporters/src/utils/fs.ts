import { join } from 'path';
import { writeFileSync, readFile } from 'fs';

export const writeFile = <T extends {}>(outputFolder: string, fileName: string, data: string | T) => {
    const fullPath = join(outputFolder, fileName);
    const content = typeof data === 'string' ? data : JSON.stringify(data, null, ' ');

    writeFileSync(fullPath, content, { encoding: 'utf-8' });
};

export const readFileAsync = (p: string): Promise<string> =>
    new Promise((res, rej) => {
        readFile(p, { encoding: 'utf8' }, (err, data) => (err ? rej(err) : res(data)));
    });
