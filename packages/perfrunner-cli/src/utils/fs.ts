import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { cwd } from 'process';

export const ensureFolderCreated = (pathToFolder: string) => {
    if (!existsSync(pathToFolder)) {
        mkdirSync(pathToFolder, { recursive: true });
    }
};

export const withRootPath = (relativePath: string) => join(cwd(), relativePath);

export async function loadExternalModule<T>(path: string): Promise<T> {
    const isFileExists = existsSync(path);

    if (!isFileExists) {
        throw new Error(`'External reporter not found in: ${path}`);
    }

    const module = await import(withRootPath(path));
    const reporter = module.default;
    const isFunction = typeof reporter === 'function';

    if (!isFunction) {
        throw new Error('External reporter found, but it is not a function');
    }

    return reporter as T;
}
