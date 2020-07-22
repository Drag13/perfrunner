import { Nullish } from './types';

export const defined = <T>(x: Nullish<T>): x is T => x != null;

export const isNullOrEmpty = (nullableString: Nullish<string>): nullableString is undefined =>
    !defined(nullableString) || nullableString.trim() === '' ? true : false;

export const isNullOrNaN = (nullableNumber: Nullish<number>): nullableNumber is undefined =>
    !defined(nullableNumber) || isNaN(nullableNumber) ? true : false;
