import cmd, { OptionDefinition } from 'command-line-args';
import { argsLike } from '../utils';
import { Bool, Network, ArgsLikeString, StringOrNumber, LogLevel } from './custom-types';
import { Original, HSPA_Plus } from './custom-types/network';
import { PerfrunnerParams } from '../perfrunner-params';

interface ProfileOptionDefintion<T> extends OptionDefinition {
    name: keyof PerfrunnerParams;
    type: (args?: string) => T extends Array<infer V> ? V : T;
    defaultValue?: T;
}

type ParamsMap = { [key in keyof PerfrunnerParams]: Omit<ProfileOptionDefintion<PerfrunnerParams[key]>, 'name'> };

const options: ParamsMap = {
    url: { type: String, defaultOption: true },
    timeout: { type: Number, defaultValue: 90_000 },
    cache: { type: Bool, multiple: true, defaultValue: [false], alias: 'C' },
    throttling: { type: Number, defaultValue: 2, alias: 'T' },
    network: { type: Network, defaultValue: [Original, HSPA_Plus], multiple: true },
    output: { type: String, defaultValue: 'generated' },
    purge: { type: Boolean, defaultValue: false },
    reporter: { type: String, multiple: true, defaultValue: ['html'] },
    runs: { type: Number, defaultValue: 3, alias: 'R' },
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

export const definitions = Object.entries(options).map(([k, v]) => ({ ...v, name: argsLike(k) }));

type PerfrunnerCliParams = PerfrunnerParams & { _unknown: string[] };

export const parseConsole = () => <PerfrunnerCliParams>cmd(definitions, { camelCase: true, stopAtFirstUnknown: true });
