import cmd, { OptionDefinition } from 'command-line-args';
import { TestParams } from '../params/params';
import { ArgsLikeString, Bool, LogLevel, Network, StringOrNumber } from './custom-types';
import { Original, HSPA_Plus } from '../params/network';
import { argsLike, isNullOrEmpty } from '../utils/string';
import { RunTestsFromConsoleCommand, RunTestsFromConfigCommand, InitConfigCommand } from '../commands';
import { ICommand } from '../commands/icommand';
import {
    DEFAULT_CONFIG_NAME,
    DEFAULT_FOLRDER_CONFIG,
    DEFAULT_OUTPUT_FOLDER,
    DEFAULT_REPORTER,
    DEFAULT_THROTTLING_RATE,
    DEFAULT_TIMEOUT,
    DEFAULT_NUMBER_RUNS,
} from '../config';

interface CliOptionDefinition<T> extends OptionDefinition {
    name: keyof TestParams;
    type: (args?: string) => T extends Array<infer V> ? V : T;
    defaultValue?: T;
}

type ParamsMap = { [key in keyof TestParams]: Omit<CliOptionDefinition<TestParams[key]>, 'name'> };

const options: ParamsMap = {
    url: { type: String, defaultOption: true },
    timeout: { type: Number, defaultValue: DEFAULT_TIMEOUT },
    cache: { type: Bool, multiple: true, defaultValue: [false], alias: 'C' },
    throttling: { type: Number, defaultValue: DEFAULT_THROTTLING_RATE, alias: 'T' },
    network: { type: Network, defaultValue: [Original, HSPA_Plus], multiple: true },
    output: { type: String, defaultValue: DEFAULT_OUTPUT_FOLDER },
    purge: { type: Boolean, defaultValue: false },
    reporter: { type: String, multiple: true, defaultValue: [DEFAULT_REPORTER] },
    runs: { type: Number, defaultValue: DEFAULT_NUMBER_RUNS, alias: 'R' },
    noHeadless: { type: Boolean, defaultValue: false },
    comment: { type: String },
    testName: { type: String },
    reportOnly: { type: Boolean },
    chromeArgs: { type: ArgsLikeString, multiple: true },
    ignoreDefaultArgs: { type: Boolean },
    waitFor: { type: StringOrNumber, alias: 'W' },
    logLevel: { type: LogLevel, defaultValue: undefined },
    executablePath: { type: String, alias: 'E' },
};

const definitions = Object.entries(options).map(([k, v]) => ({ ...v, name: argsLike(k) }));

type PerfrunnerCliParams = TestParams & { _unknown: string[] };

export const parseUserInput = () => <PerfrunnerCliParams>cmd(definitions, { camelCase: true, stopAtFirstUnknown: true });

export function commandFactory(initialInput: PerfrunnerCliParams): ICommand {
    const [commandName] = initialInput._unknown || (initialInput.url || '').toLowerCase() === 'init' ? ['init'] : [];

    if (isNullOrEmpty(commandName)) {
        const isUrlPassed = !isNullOrEmpty(initialInput.url);
        return isUrlPassed
            ? new RunTestsFromConsoleCommand(initialInput)
            : new RunTestsFromConfigCommand({ configName: DEFAULT_CONFIG_NAME, pathToFolder: DEFAULT_FOLRDER_CONFIG });
    }

    if (commandName.toLowerCase() === '--from-config') {
        return new RunTestsFromConfigCommand({ configName: DEFAULT_CONFIG_NAME, pathToFolder: DEFAULT_FOLRDER_CONFIG });
    }

    const initCommandArgsDefinition = [
        { name: 'url', defaultOption: true, type: String },
        { name: 'init', type: Boolean, defaultValue: true },
    ];

    const initCommandArgs = <{ url: string }>cmd(initCommandArgsDefinition, { camelCase: true, argv: initialInput._unknown || [] });

    return new InitConfigCommand({
        configName: DEFAULT_CONFIG_NAME,
        pathToFolder: DEFAULT_FOLRDER_CONFIG,
        url: [initCommandArgs.url],
    });
}
