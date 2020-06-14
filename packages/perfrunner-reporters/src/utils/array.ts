const initArrayWith = <T>(initValue: T, length: number) => Array(length).fill(initValue);

export const init0 = (length: number) => initArrayWith(0, length);

export const splitBy = <T>(arr: T[], min: number): T[][] => {
    const res = [];
    while (arr.length > 0) {
        res.push(arr.splice(0, min));
    }

    return res;
};

// const includes = <T>(arr: T[], predicate: (arg: T) => boolean) => arr.some(predicate);
