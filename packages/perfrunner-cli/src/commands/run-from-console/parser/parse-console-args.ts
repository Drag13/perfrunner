import cmd, { OptionDefinition } from 'command-line-args';
import { ConsoleConfig } from '../console-config';
import {
    DEFAULT_NUMBER_RUNS,
    DEFAULT_OUTPUT_FOLDER,
    DEFAULT_REPORTER,
    DEFAULT_THROTTLING_RATE,
    DEFAULT_TIMEOUT,
} from '../../../config';

import { ArgsLikeString, Bool, LogLevel, Network, StringOrNumber } from './custom-types';

import { HSPA_Plus, Original } from '../../../params/network';
import { argsLike } from '../../../utils';

interface CliOptionDefinition<T> extends OptionDefinition {
    name: keyof ConsoleConfig;
    type: (args?: string) => T extends Array<infer V> ? V : T;
    defaultValue?: T;
}

type ParamsMap = { [key in keyof ConsoleConfig]: Omit<CliOptionDefinition<ConsoleConfig[key]>, 'name'> };

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

export const parseUserInput = () => <ConsoleConfig>cmd(definitions, { camelCase: true, stopAtFirstUnknown: true });
