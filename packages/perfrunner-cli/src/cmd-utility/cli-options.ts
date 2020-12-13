import { OptionDefinition } from 'command-line-args';

interface CliOptionDefinition<TKeys extends string, TValue> extends OptionDefinition {
    name: TKeys;
    type: (args?: string) => TValue extends Array<infer V> ? V : TValue;
    defaultValue?: TValue;
}

export type CliOptions<TParams extends {}> = {
    //@ts-ignore
    [key in keyof TParams]: Omit<CliOptionDefinition<key, TParams[key]>, 'name'>;
};
