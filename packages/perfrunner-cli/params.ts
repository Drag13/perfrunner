import { OptionDefinition } from 'command-line-args';
import { NetworkCondtionFactory, Fast3g } from './options';
import { NetworkSetup } from 'perfrunner-core/profiler/perf-options';

type NotImplementedParams = {
    purge: boolean,
}

export interface CliParams extends NotImplementedParams {
    url: string;
    timeout: number;
    throttling: number;
    network: NetworkSetup;
    output: string;
    runs: number;
    cache: boolean;

    reporter: 'json'
}

interface ProfileOptionDefintion extends OptionDefinition {
    name: keyof CliParams;
}

export const params: ProfileOptionDefintion[] = [
    {
        name: 'url',
        type: String,
        defaultOption: true
    },
    {
        name: 'timeout',
        type: Number,
        defaultValue: 30_000
    },
    {
        name: 'throttling',
        type: Number,
        defaultValue: 2
    },
    {
        name: "network",
        type: NetworkCondtionFactory,
        defaultValue: Fast3g
    },
    {
        name: 'output',
        type: String,
        defaultValue: './_perf'
    },
    {
        name: 'runs',
        type: Number,
        defaultValue: 3
    },
    {
        name: 'cache',
        type: Boolean,
        defaultValue: false
    },
    {
        name: 'reporter',
        defaultValue: 'json'
    }
];

