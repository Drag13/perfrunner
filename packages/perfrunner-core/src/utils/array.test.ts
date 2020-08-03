import 'mocha';
import { expect } from 'chai';
import { orderByDescending } from './array';

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

describe('orderByDescending', () => {
    testSuite.forEach(({ expected, input }) => {
        it(`for ${JSON.stringify(input)} should return ${JSON.stringify(expected)}`, () => {
            const [latest] = orderByDescending(input, (x) => x.age);

            expect(latest).eqls(expected);
        });
    });
});
