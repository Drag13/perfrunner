import cmd from 'command-line-args';
import { isNullOrEmpty } from '../utils';
import { CliOptions, toCmdDefinitions, LogLevel } from '../cmd-utility';

type CommandName = `create-config` | `run-test-from-config` | `run-test-from-console`;

type InitialParams = {
    url: string;
    init: boolean;
    logLevel: string | undefined;
};

const initialParamsDefinition: CliOptions<InitialParams> = {
    init: { type: Boolean, defaultValue: false },
    url: { type: String, defaultOption: true },
    logLevel: { type: LogLevel, defaultValue: undefined },
};

export function getCommand(): { cmd: CommandName; logLevel?: string } {
    const argsDefinitions = toCmdDefinitions(initialParamsDefinition);
    const { init, logLevel, url } = <InitialParams>cmd(argsDefinitions, { camelCase: true, partial: true });

    if (init) {
        return { cmd: 'create-config', logLevel };
    }

    if (isNullOrEmpty(url)) {
        return { cmd: 'run-test-from-config', logLevel };
    }

    return { cmd: 'run-test-from-console', logLevel };
}
