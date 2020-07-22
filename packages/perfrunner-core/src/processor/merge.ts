export type Nullish<T> = T | null | undefined;

type MergeFunc<T> = (values: T[]) => T | null;
export type MergeMap<T> = { [key in keyof T]?: MergeFunc<T[key]> };

export const exclude = () => null;

export const first = <T>(values: T[]) => values[0];

export const average = (values: Nullish<number>[]) => {
    const withoutNulls = values.filter((v) => v != null && !isNaN(v)) as number[];
    return withoutNulls.length ? withoutNulls.reduce((sum, v) => sum + v, 0) / withoutNulls.length : 0;
};

const getDefaultMergeFunc = <T>(value: T): MergeFunc<T> => {
    const valueType = typeof value;

    switch (valueType) {
        case 'string':
            return first;
        case 'number':
            return average as MergeFunc<any>;
    }

    if (Object.prototype.toString.call(value) === '[object Object]') {
        return (data: T[]) => mergeWithRules(data);
    }

    return exclude;
};

export function mergeWithRules<T>(data: T[], rules?: MergeMap<T>) {
    // store data from all runs
    var accumulator: { [key: string]: any[] } = {};

    // fill the store with key | values
    data.forEach((obj) => {
        const entries = Object.entries(obj);
        entries.forEach(([key, value]) => {
            if (accumulator[key]) {
                accumulator[key].push(value);
            } else {
                accumulator[key] = [value];
            }
        });
    });

    // apply merge rule to the array of values
    return (Object.entries(accumulator).reduce((acc, [key, values]) => {
        const definedValue = values.find((x) => x != undefined);
        const customRule = rules ? rules[key as keyof T] : undefined;
        const rule = typeof customRule === 'function' ? customRule : getDefaultMergeFunc(definedValue);
        const mergeResult = rule!(values);

        if (mergeResult != null) {
            acc[key] = mergeResult;
        }

        return acc;
    }, {} as { [key: string]: any[] }) as unknown) as T;
}
