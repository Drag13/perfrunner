import cmd from 'command-line-args';
import { DEFAULT_CONFIG_NAME, DEFAULT_FOLRDER_CONFIG } from '../../config';
import { URL_IS_EMPTY } from '../../errors';

export const parseInitParams = () => {
    const { url: urls } = <{ url: string[] }>cmd([{ name: 'url', defaultOption: true, multiple: true }], { partial: true });

    if (urls == null || urls.length === 0) {
        throw new Error(URL_IS_EMPTY);
    }

    return {
        urls,
        outputToFolder: DEFAULT_FOLRDER_CONFIG,
        configName: DEFAULT_CONFIG_NAME,
    };
};
