export const isNullOrEmpty = (nullableString: string | undefined): nullableString is undefined =>
    nullableString == null || nullableString.trim() === '' ? true : false;

export const argsLike = (v: string) =>
    v
        .split(/(?=[A-Z])/g)
        .join('-')
        .toLowerCase();
