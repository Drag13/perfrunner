import 'mocha';
import { expect } from 'chai';
import { ValidationError } from 'yup';

import { PerfRunnerOptions } from '../../dist';
import { validator } from './validation';

const validModel = {
    url: 'https://drag13.github.io',
    testName: 'test',
    headless: true,
    network: {
        latency: 1,
        downloadThroughput: 1,
        uploadThroughput: 1,
    },
    output: 'test',
    purge: false,
    runs: 3,
    throttlingRate: 3,
    timeout: 30000,
    useCache: false,
    chromeArgs: [],
    comment: 'test',
    ignoreDefaultArgs: false,
    reportOnly: false,
    waitFor: 300,
};

const deepClone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

class TestCase {
    constructor(readonly input: { [key in keyof PerfRunnerOptions]: any }, readonly expected: boolean, readonly testName: string) {}
}

const testSuite = [
    new TestCase(deepClone(validModel), true, 'Valid model should be valid'),
    new TestCase({ ...deepClone(validModel), url: 'http://localhost:1234/' }, true, 'localhost should be valid url'),
    new TestCase({ ...deepClone(validModel), url: 'testURl' }, false, 'When URL is not correct, error should be fired'),
    new TestCase({ ...deepClone(validModel), testName: 5 }, false, 'When testName is not string, error should be fired'),
];

describe(`PerfRunnerOptions validation`, () => {
    testSuite.forEach((tc) => {
        it(tc.testName, async () => {
            try {
                await validator.validate(tc.input);
            } catch (error) {
                if (tc.expected) {
                    console.log((error as ValidationError).errors);
                }
            }

            const isValid = await validator.isValid(tc.input);
            expect(isValid).equal(tc.expected);
        });
    });
});
