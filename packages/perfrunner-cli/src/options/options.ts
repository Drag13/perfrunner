import { OptionDefinition } from 'command-line-args';
import { NetworkCondtionFactory, HSPA } from './network';
import { NetworkSetup } from 'perfrunner-core';
import { ArgsLikeString } from './arg-like-string';
import { StringOrNumber } from './string-number';
import { argsLike } from '../utils/args-like';
import { LogLevel } from './log-level';
import { Url } from './url';

export interface CliParams {
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
}

interface ProfileOptionDefintion<T> extends OptionDefinition {
    name: keyof CliParams;
    type: (args?: string) => T extends Array<infer V> ? V : T;
    defaultValue?: T;
}

type ParamsMap = { [key in keyof CliParams]: Omit<ProfileOptionDefintion<CliParams[key]>, 'name'> };

const map: ParamsMap = {
    url: { type: Url, defaultOption: true },
    timeout: { type: Number, defaultValue: 60_000 },
    cache: { type: Boolean, defaultValue: false, alias: 'C' },
    throttling: { type: Number, defaultValue: 2, alias: 'T' },
    network: { type: NetworkCondtionFactory, defaultValue: HSPA },
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
};

export const params = Object.entries(map).map(([k, v]) => ({ ...v, name: argsLike(k) }));
