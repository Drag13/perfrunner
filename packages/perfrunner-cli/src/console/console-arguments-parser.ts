import cmd, { OptionDefinition } from 'command-line-args';
import { TestParams } from '../commands/test-params';
import { argsLike } from '../utils';
import { Url, Bool, Network, ArgsLikeString, StringOrNumber, LogLevel } from './custom-types';
import { Original, HSPA_Plus } from './custom-types/network';

interface ProfileOptionDefintion<T> extends OptionDefinition {
    name: keyof TestParams;
    type: (args?: string) => T extends Array<infer V> ? V : T;
    defaultValue?: T;
}

type ParamsMap = { [key in keyof TestParams]: Omit<ProfileOptionDefintion<TestParams[key]>, 'name'> };

const options: ParamsMap = {
    url: { type: Url, defaultOption: true },
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

export const parseConsole = () => <TestParams & { _unknown: string[] }>cmd(definitions, { camelCase: true, stopAtFirstUnknown: true });
