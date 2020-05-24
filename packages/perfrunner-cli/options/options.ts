import { OptionDefinition } from 'command-line-args';
import { NetworkCondtionFactory, Fast3g } from './network';
import { NetworkSetup } from 'perfrunner-core/profiler/perf-options';

type NotImplementedParams = {
}

export interface CliParams extends NotImplementedParams {
    url: string;
    timeout: number;
    throttling: number;
    network: NetworkSetup;
    output: string;
    runs: number;
    cache: boolean;
    reporter: string;
    purge: boolean,
}

interface ProfileOptionDefintion<T> extends OptionDefinition {
    name: keyof CliParams;
    type: (args?: string) => T,
    defaultValue?: T
}

type ParamsMap = { [key in keyof CliParams]: Omit<ProfileOptionDefintion<CliParams[key]>, 'name'> }

const map: ParamsMap = {
    url: { type: String, defaultOption: true },
    timeout: { type: Number, defaultValue: 30_000 },
    cache: { type: Boolean, defaultValue: false },
    throttling: { type: Number, defaultValue: 2 },
    network: { type: NetworkCondtionFactory, defaultValue: Fast3g },
    output: { type: String, defaultValue: './generated' },
    purge: { type: Boolean, defaultValue: false },
    reporter: { type: String, defaultValue: 'basic' },
    runs: { type: Number, defaultValue: 3 }
}

export const params = Object.entries(map).map(([k, v]) => ({ ...v, name: k }));
