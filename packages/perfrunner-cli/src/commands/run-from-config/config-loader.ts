import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { logger } from 'perfrunner-core';
import { CONFIG_NOT_EXISTS } from '../../errors';
import { withRootPath } from '../../utils';
import { Url } from '../mapper/url';
import { JsonConfig, PageSetup } from './json-config';

export function loadConfig(pathToFolder: string, configName: string): JsonConfig {
    const fullPathToConfig = join(withRootPath(pathToFolder), configName);
    if (!existsSync(fullPathToConfig)) {
        throw CONFIG_NOT_EXISTS;
    }

    logger.log(`Loading ${configName}`);

    const config = JSON.parse(readFileSync(fullPathToConfig, { encoding: 'utf-8' }), (key, value) => {
        if (key === 'page' && Array.isArray(value)) {
            return value.map((x: PageSetup) => ({ ...x, url: Url(x.url).href }));
        }
        return value;
    });

    return config;
}
