const getValuesByKey = <T>(key: keyof T, arr: T[]): any[] => {
    return arr.map(x => x[key]);
}

export function getAverageExcludeZero<T>(key: keyof T, arr: T[]): number {
    const values = getValuesByKey(key, arr);
    let i = 0;
    const summ = values.reduce((sum, v) => {
        if (v && typeof v === 'number') { sum += v; i++; }
        return sum;
    }, 0);

    return i === 0 ? 0 : summ / i;
}

type MergeRule = 'average' | 'exclude' | 'first';

export type RuleSet<T> = { [key in (keyof Partial<T>)]?: MergeRule };

const getRule = <T>(rule: MergeRule | undefined, value: T): MergeRule => {
    if (rule) { return rule }
    if (typeof value === 'number') { return 'average'; }
    if (typeof value === 'string') { return 'first' }
    return 'exclude';
}

export function mergeWithRules<T>(data: T[], rules?: RuleSet<T>) {

    const ideal = data[0]; // unsafe
    const keys = Object.keys(ideal) as (keyof T)[];

    const merged = keys.reduce((result, key) => {

        const rule = getRule(rules ? rules[key] : undefined, ideal[key]);

        switch (rule) {
            case 'first': result[key] = ideal[key]; break;
            case 'exclude': break;
            case 'average': result[key] = getAverageExcludeZero(key, data) as any;
        }

        return result;

    }, {} as T);

    return merged;
}

export const groupEntries = (rawPerformanceData: PerformanceEntry[][]): PerformanceEntry[][] => {

    const runs = rawPerformanceData;

    const combined = runs[0].reduce((result, pEntry) => {
        const sameEntries = runs.reduce((acc, v) => {
            const same = v.find((x) => x.entryType === pEntry.entryType && x.name === pEntry.name);
            same && acc.push(same);
            return acc;
        }, []);

        result.push(sameEntries);

        return result;
    }, [] as PerformanceEntry[][])

    return combined;
}
