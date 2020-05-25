import { getValuesByKey } from "./utils";

type MergeFunc<T> = (values: T[]) => T | null;
export type MergeMap<T> = { [key in keyof T]?: MergeFunc<T[key]> };

export const exclude = () => null;

export const first = <T>(values: T[]) => values[0];

export const average = (values: number[]) => {
    const withoutNulls = values.filter(v => v != null);
    return withoutNulls.length ? withoutNulls.reduce((sum, v) => sum + v, 0) / withoutNulls.length : 0;
}

const getDefaultMergeFunc = <T>(value: T): MergeFunc<T> => {
    const valueType = typeof value;

    switch (valueType) {
        case 'string': return first;
        case 'number': return average as MergeFunc<any>;
        default: return exclude;
    }
}

export function mergeWithRules<T>(data: T[], rules?: MergeMap<T>) {

    const ideal = data[0]; // unsafe
    const keys = Object.keys(ideal) as (keyof T)[];

    const merged = keys.reduce((result, key) => {

        const rule = rules && typeof rules[key] === 'function' ? rules[key]! : getDefaultMergeFunc(ideal[key]);
        const values = getValuesByKey(key, data);
        const mergeResult = rule(values);

        if (mergeResult != null) { result[key] = mergeResult }

        return result;

    }, {} as T);

    return merged;
}
