import { OptionDefinition } from 'command-line-args';
import { NetworkCondtionFactory, Fast3g } from './network';
import { NetworkSetup } from 'perfrunner-core/profiler/perf-options';
import { ArgsLikeString } from './arg-like-string';
import { StringOrNumber } from "./string-number";
import { argsLike } from './../utils/args-like';

export interface CliParams {
    url: string;
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
}

interface ProfileOptionDefintion<T> extends OptionDefinition {
    name: keyof CliParams;
    type: (args?: string) => T extends Array<infer V> ? V : T,
    defaultValue?: T,
}

type ParamsMap = { [key in keyof CliParams]: Omit<ProfileOptionDefintion<CliParams[key]>, 'name'> }

const map: ParamsMap = {
    url: { type: String, defaultOption: true },
    timeout: { type: Number, defaultValue: 60_000 },
    cache: { type: Boolean, defaultValue: false },
    throttling: { type: Number, defaultValue: 2, alias: 'T' },
    network: { type: NetworkCondtionFactory, defaultValue: Fast3g },
    output: { type: String, defaultValue: 'generated' },
    purge: { type: Boolean, defaultValue: false },
    reporter: { type: String, multiple: true, defaultValue: ['basic'] },
    runs: { type: Number, defaultValue: 3 },
    noHeadless: { type: Boolean, defaultValue: false },
    comment: { type: String },
    testName: { type: String },
    reportOnly: { type: Boolean },
    chromeArgs: { type: ArgsLikeString, multiple: true },
    ignoreDefaultArgs: { type: Boolean },
    waitFor: { type: StringOrNumber }
}

export const params = Object.entries(map).map(([k, v]) => ({ ...v, name: argsLike(k) }));
