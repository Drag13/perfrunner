import cmd from 'command-line-args';
import { DEFAULT_CONFIG_NAME, DEFAULT_FOLRDER_CONFIG } from '../../config';
import { URL_IS_EMPTY } from '../../errors';
import { Url } from '../mapper/url';

export const parseInitParams = () => {
    const { url } = <{ url: string[] }>cmd([{ name: 'url', defaultOption: true, multiple: true }], { partial: true });

    if (url == null || url.length === 0) {
        throw new Error(URL_IS_EMPTY);
    }

    const urls = url.map((url) => Url(url).href);

    return {
        urls,
        outputToFolder: DEFAULT_FOLRDER_CONFIG,
        configName: DEFAULT_CONFIG_NAME,
    };
};
