import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { cwd } from 'process';

export const ensureFolderCreated = (pathToFolder: string) => {
    if (!existsSync(pathToFolder)) {
        mkdirSync(pathToFolder, { recursive: true });
    }
};

export const withRootPath = (relativePath: string) => join(cwd(), relativePath);
