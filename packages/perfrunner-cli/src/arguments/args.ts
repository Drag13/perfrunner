import { OptionDefinition } from 'command-line-args';
import { NetworkSetup } from 'perfrunner-core';
import { Url, Network, ArgsLikeString, StringOrNumber, LogLevel, HSPA } from './typeFactories';
import { argsLike } from '../utils';

export type ConsoleArguments = {
    url: URL;
    timeout: number;
    throttling: number;
    network: NetworkSetup;
    output: string;
    runs: number;
    cache: boolean;
    reporter: string[];
    purge: boolean;
    noHeadless: boolean;
    comment: string;
    testName: string;
    reportOnly: boolean;
    chromeArgs: string[];
    ignoreDefaultArgs: boolean;
    waitFor: number | string;
    logLevel: string | undefined;
    test: { name: string };
};

interface ProfileOptionDefintion<T> extends OptionDefinition {
    name: keyof ConsoleArguments;
    type: (args?: string) => T extends Array<infer V> ? V : T;
    defaultValue?: T;
}

type ParamsMap = { [key in keyof ConsoleArguments]: Omit<ProfileOptionDefintion<ConsoleArguments[key]>, 'name'> };

const options: ParamsMap = {
    url: { type: Url, defaultOption: true },
    timeout: { type: Number, defaultValue: 60_000 },
    cache: { type: Boolean, defaultValue: false, alias: 'C' },
    throttling: { type: Number, defaultValue: 2, alias: 'T' },
    network: { type: Network, defaultValue: HSPA },
    output: { type: String, defaultValue: 'generated' },
    purge: { type: Boolean, defaultValue: false },
    reporter: { type: String as any, multiple: true, defaultValue: ['html'] },
    runs: { type: Number, defaultValue: 3, alias: 'R' },
    noHeadless: { type: Boolean, defaultValue: false },
    comment: { type: String },
    testName: { type: String },
    reportOnly: { type: Boolean },
    chromeArgs: { type: ArgsLikeString, multiple: true },
    ignoreDefaultArgs: { type: Boolean },
    waitFor: { type: StringOrNumber, alias: 'W' },
    logLevel: { type: LogLevel, defaultValue: undefined },
    test: { type: (_: string | undefined) => ({ name: 'tets' }), defaultValue: { name: 'test' } },
};

export const definitions = Object.entries(options).map(([k, v]) => ({ ...v, name: argsLike(k) }));
