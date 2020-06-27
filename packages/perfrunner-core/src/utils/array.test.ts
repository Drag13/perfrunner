import 'mocha';
import { expect } from 'chai';
import { latestBy } from './array';

type Obj = {
    age: number;
};

class TestCase {
    constructor(readonly input: Obj[], readonly expected: Obj) {}
}

const testSuite = [
    new TestCase([{ age: 66 }, { age: 66 }, { age: 55 }], { age: 66 }),
    new TestCase([{ age: -1 }, { age: 4 }], { age: 4 }),
    new TestCase([], undefined),
];

describe('latestBy', () => {
    testSuite.forEach(({ expected, input }) => {
        it(`for ${JSON.stringify(input)} should return ${JSON.stringify(expected)}`, () => {
            const latest = latestBy(
                input,
                (x) => !!x,
                (x) => x.age
            );

            expect(latest).eqls(expected);
        });
    });
});
