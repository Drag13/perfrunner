import { join } from 'path';
import { writeFileSync } from 'fs';

export const writeFile = <T extends {}>(outputFolder: string, fileName: string, data: string | T) => {
    const fullPath = join(outputFolder, fileName);
    const content = typeof data === 'string' ? data : JSON.stringify(data, null, ' ');

    writeFileSync(fullPath, content, { encoding: 'utf-8' });
}