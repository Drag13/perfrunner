import cmd from 'command-line-args';
import { NetworkSetup } from 'perfrunner-core';
import { ArgsLikeString, Bool, CliOptions, LogLevel, Network, StringOrNumber, UrlBasedString } from '../../cmd-utility';
import {
    DEFAULT_REPORTER,
    DEFAULT_OUTPUT_FOLDER,
    DEFAULT_TIMEOUT,
    DEFAULT_THROTTLING_RATE,
    DEFAULT_NUMBER_RUNS,
    Original,
    HSPA_Plus,
} from '../../config';
import { argsLike } from '../../utils';

export type ConsoleConfig = {
    url: string;
    timeout: number;
    runs: number;
    reporter: string[];
    purge: boolean;
    noHeadless: boolean;
    testName: string | undefined;
    reportOnly: boolean;
    chromeArgs: string[] | undefined;
    ignoreDefaultArgs: boolean;
    waitFor: number | string | undefined;
    logLevel: string | undefined;
    output: string;
    comment: string | undefined;
    executablePath: string | undefined;
    network: NetworkSetup[];
    throttling: number;
    cache: boolean[];
};

const options: CliOptions<ConsoleConfig> = {
    url: { type: UrlBasedString, defaultOption: true },
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

export const parseUserInput = () => <ConsoleConfig>cmd(definitions, { camelCase: true });
