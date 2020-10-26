import cmd from 'command-line-args';
import { isNullOrEmpty } from './utils';

type Command = 'init' | 'run-test-from-console' | 'run-test-from-config';

type BasicArguments = {
    url: string;
    init: boolean;
};

export function getBasicArguments(): Command {
    var { init, url } = <BasicArguments>cmd(
        [
            {
                name: 'url',
                type: String,
                defaultOption: true,
            },
            {
                name: 'init',
                type: Boolean,
                defaultValue: false,
            },
        ],
        { camelCase: true, stopAtFirstUnknown: true }
    );

    if (init) {
        return 'init';
    }

    if (isNullOrEmpty(url)) {
        return 'run-test-from-config';
    }

    return 'run-test-from-console';
}
