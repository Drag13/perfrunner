import { existsSync, mkdirSync } from 'fs';

export const ensureFolderCreated = (pathToFolder: string) => {
    if (!existsSync(pathToFolder)) {
        mkdirSync(pathToFolder, { recursive: true });
    }
};
