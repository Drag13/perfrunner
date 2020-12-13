import { existsSync, writeFileSync } from 'fs';
import { join } from 'path';
import { logger } from 'perfrunner-core';
import { CONFIG_SHOULD_NOT_OVERRIDEN } from '../../errors';
import { ensureFolderCreated, withRootPath } from '../../utils';
import { JsonConfig, defaultJsonConfig } from './json-config';
import { parseInitParams } from './parser';

export function generateConfig(configName: string, outputToFolder: string) {
    const { urls } = parseInitParams();
    const fullPathToConfigFolder = withRootPath(outputToFolder);

    ensureFolderCreated(fullPathToConfigFolder);

    const fullPathToConfig = join(fullPathToConfigFolder, configName);

    const isConfigExisted = existsSync(fullPathToConfig);

    if (isConfigExisted) {
        throw new Error(CONFIG_SHOULD_NOT_OVERRIDEN);
    }

    const config: JsonConfig = {
        ...defaultJsonConfig,
        page: urls.map((url) => ({ url, onAfterPageLoadedScript: '', waitFor: '' })),
    };

    logger.log(`Creating ${configName}...`);

    writeFileSync(fullPathToConfig, JSON.stringify(config, null, 4), { encoding: 'utf-8' });

    logger.log(`Done`);

    return 0;
}
