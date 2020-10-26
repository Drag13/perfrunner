import { existsSync, writeFileSync } from 'fs';
import { join } from 'path';
import { logger } from 'perfrunner-core';
import { CONFIG_SHOULD_NOT_OVERRIDEN } from '../../errors';
import { ensureFolderCreated, withRootPath } from '../../utils';
import { Url } from '../mapper/url';
import { JsonConfig } from '../run-from-config/json-config';
import { defaultJsonConfig } from './json-config';
import { parseInitParams } from './parseInitParams';

export function generateConfig() {
    const { urls, configName, outputToFolder } = parseInitParams();

    const fullPathToConfigFolder = withRootPath(outputToFolder);

    ensureFolderCreated(fullPathToConfigFolder);

    const fullPathToConfig = join(fullPathToConfigFolder, configName);

    const isConfigExisted = existsSync(fullPathToConfig);

    if (isConfigExisted) {
        throw new Error(CONFIG_SHOULD_NOT_OVERRIDEN);
    }

    const config: JsonConfig = {
        ...defaultJsonConfig,
        page: urls.map((x) => ({ url: Url(x).href, onAfterPageLoadedScript: '', waitFor: '' })),
    };

    logger.log(`Creating ${configName}...`);

    writeFileSync(fullPathToConfig, JSON.stringify(config, null, 4), { encoding: 'utf-8' });

    logger.log(`Done`);

    return 0;
}
