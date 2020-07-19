export function exclude<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, Exclude<keyof T, K>> {
    return Object.keys(obj)
        .filter((key) => !keys.includes(key as K))
        .reduce((acc, key) => {
            acc[key as Exclude<keyof T, K>] = obj[key as Exclude<keyof T, K>];
            return acc;
        }, {} as Omit<T, K>);
}
