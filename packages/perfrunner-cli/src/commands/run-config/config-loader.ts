import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { logger } from 'perfrunner-core';
import { CONFIG_NOT_EXISTS } from '../../errors';
import { withRootPath } from '../../utils';
import { Url } from '../../cmd-utility';
import { JsonConfig, PageSetup } from '../init/json-config';

export function loadConfig(pathToFolder: string, configName: string): JsonConfig {
    const fullPathToConfig = join(withRootPath(pathToFolder), configName);
    if (!existsSync(fullPathToConfig)) {
        throw CONFIG_NOT_EXISTS;
    }

    logger.log(`loading ${fullPathToConfig}`);

    const rawConfig = readFileSync(fullPathToConfig, { encoding: 'utf-8' });

    const config = JSON.parse(rawConfig, (key, value) => {
        if (key === 'page' && Array.isArray(value)) {
            return value.map((x: PageSetup) => ({ ...x, url: Url(x.url).href }));
        }
        return value;
    });

    return config;
}
