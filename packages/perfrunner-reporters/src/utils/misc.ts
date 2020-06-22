export const defined = <T>(x: T | undefined): x is T => x != null;

export const isNullOrEmpty = (nullableString: string | undefined): nullableString is undefined =>
    !defined(nullableString) || nullableString.trim() === '' ? true : false;

export const isNullOrNaN = (nullableNumber: number | undefined): nullableNumber is undefined =>
    !defined(nullableNumber) || isNaN(nullableNumber) ? true : false;
