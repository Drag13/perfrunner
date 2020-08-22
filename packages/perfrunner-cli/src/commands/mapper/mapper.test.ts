import 'mocha';
import { expect } from 'chai';

import { mapArgs } from './mapper';
import { PerfrunnerParams } from "../../perfrunner-params";

describe('test', () => {
    const input: PerfrunnerParams = {
        cache: [true],
        chromeArgs: [],
        comment: '',
        ignoreDefaultArgs: false,
        logLevel: 'test',
        network: [{} as any],
        noHeadless: true,
        output: '',
        purge: true,
        reportOnly: true,
        reporter: ['html', 'arg1', 'arg2'],
        runs: 45,
        testName: 'testName',
        throttling: 2,
        timeout: 500,
        url: 'http://drag13.io',
        waitFor: 500,
        executablePath: 'test'
    };

    const result = mapArgs(input);
    expect(result.perfrunnerOptions[0].testName).to.be.equal(input.testName);

    expect(result.reporterOptions.name).to.be.equal(input.reporter[0]);
    expect(result.reporterOptions.params).to.be.eqls(input.reporter.slice(1, input.reporter.length));
});
