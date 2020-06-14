type MapFunc<T> = (v: T) => T;

type TransformMap<T> = { [key in keyof T]?: MapFunc<T[key]> };

export const transform = <T extends { [key: string]: any }>(obj: T, map: TransformMap<T>): T => {
    const result = {} as T;

    Object.entries(obj).forEach(([key, value]) => {
        const rule = map[key];
        //@ts-ignore
        result[key] = typeof rule === 'function' ? rule(value) : value;
    });

    return result;
};
