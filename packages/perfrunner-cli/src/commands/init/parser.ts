import cmd from 'command-line-args';
import { URL_IS_EMPTY } from '../../errors';
import { Url } from '../../cmd-utility';

import { CliOptions, toCmdDefinitions } from '../../cmd-utility';

type InitParams = {
    url: string;
};

const initParamsDefinition: CliOptions<InitParams> = {
    url: {
        defaultOption: true,
        type: String,
        multiple: true,
    },
};

export const parseInitParams = () => {
    const { url } = <{ url: string[] }>cmd(toCmdDefinitions(initParamsDefinition), { partial: true });

    if (url == null || url.length === 0) {
        throw new Error(URL_IS_EMPTY);
    }

    const urls = url.map((url) => Url(url).href);

    return {
        urls,
    };
};
