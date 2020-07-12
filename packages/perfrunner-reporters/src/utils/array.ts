const initArrayWith = <T>(initValue: T, length: number): Array<T> => Array(length).fill(initValue);

export const init0 = (length: number) => initArrayWith(0, length);
export const initWithEmptyString = (length: number) => initArrayWith('', length);

export const splitBy = <T>(arr: T[], min: number): T[][] => {
    const res = [];
    while (arr.length > 0) {
        res.push(arr.splice(0, min));
    }

    return res;
};

export const groupBy = <T>(array: T[], hashFunc: (el: T) => string): T[][] => {
    const groupedData = array.reduce((acc, el) => {
        const hash = hashFunc(el);

        if (acc.has(hash)) {
            acc.get(hash)!.push(el);
        } else {
            acc.set(hash, [el]);
        }

        return acc;
    }, new Map<string, T[]>());

    const result: T[][] = []; // for some reason [...groupedData] throws an error
    groupedData.forEach((x) => result.push(x));

    return result;
};
