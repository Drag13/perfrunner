import { ArgsLikeString } from './custom-types';
import { expect } from 'chai';

class TestCase {
    constructor(readonly arg: string, readonly expected: string) {}
}

const testSuite = [new TestCase('test', '--test'), new TestCase('testArgument', '--test-argument')];

describe('when input is', () => {
    testSuite.forEach((tc) => {
        it(`${tc.arg} it should be formatted as ${tc.expected}`, () => {
            const result = ArgsLikeString(tc.arg);
            expect(result).to.be.be.equal(tc.expected);
        });
    });
});
