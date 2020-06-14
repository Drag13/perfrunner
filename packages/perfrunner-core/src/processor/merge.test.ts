import 'mocha';
import { expect } from 'chai';
import { average, mergeWithRules } from './merge';

class AverageTestCase {
    constructor(readonly input: number[], readonly expected: number) {}
}

const averageTestSuite = [
    new AverageTestCase([1, 3], 2),
    new AverageTestCase([1, NaN, 3], 2),
    new AverageTestCase([1, null, 3], 2),
    new AverageTestCase([1, 0, 5], 2),
];

class MergeTestCase<T extends {}> {
    constructor(readonly input: T[], readonly expected: T) {}
}

const mergeTestSuite = [
    new MergeTestCase([{ name: 'test', value: 1 }], { name: 'test', value: 1 }),
    new MergeTestCase([{ name: 'test', value: 1 }, { value: 3 }], { name: 'test', value: 2 }),
    new MergeTestCase([{ value: 1 }, { value: 3, name: 'test', unexpected: 5 }], { name: 'test', value: 2, unexpected: 5 }),
    new MergeTestCase([{ name: 'test', value: 1, inner: { value: 5 } }], { name: 'test', value: 1, inner: { value: 5 } }),
];

describe('Merge module', () => {
    averageTestSuite.forEach((tc) => {
        it(`for: ${tc.input} average func should return: ${tc.expected} result`, () => {
            const averageResult = average(tc.input);
            expect(averageResult).equals(tc.expected);
        });
    });

    mergeTestSuite.forEach((tc) => {
        it(`for: ${JSON.stringify(tc.input)} merge func should return: ${JSON.stringify(tc.expected)} result`, () => {
            const mergeResult = mergeWithRules(tc.input);
            expect(mergeResult).eqls(tc.expected);
        });
    });
});
