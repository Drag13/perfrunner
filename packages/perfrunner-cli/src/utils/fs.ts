import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { cwd } from 'process';

export const ensureFolderCreated = (pathToFolder: string) => {
    if (!existsSync(pathToFolder)) {
        mkdirSync(pathToFolder, { recursive: true });
    }
};

type FullPath = string & { _: unknown };
export const withRootPath = (relativePath: string, ...path: string[]): FullPath => join(cwd(), relativePath, ...path) as FullPath;

export async function loadExternalModule<T>(path: string): Promise<T> {
    const isFileExists = existsSync(path);

    if (!isFileExists) {
        throw new Error(`'External reporter not found in: ${path}`);
    }
    const module = await import(withRootPath(path));
    const main = module.default;

    const exists = main != null;

    if (!exists) {
        throw new Error(`Reporter: "${path}" doesn't exists`);
    }

    return main as T;
}

export const writeFile = (fullPath: FullPath, content: string) => writeFileSync(fullPath, content, { encoding: 'utf-8' });
