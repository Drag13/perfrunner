#!/usr/bin/env node

import cmd from "./cmd";
import { join } from "path";
import { profile, PerfRunnerOptions } from "perfrunner-core";
import { loader } from "./utils/reporter-loader";

(async function (): Promise<number> {
    const inputParams = cmd();
    const profileParams: PerfRunnerOptions = { ...inputParams, useCache: inputParams.cache, throttlingRate: inputParams.throttling, headless: !inputParams.noHeadless };

    try {
        const performanceResult = await profile(profileParams);
        const report = await loader(inputParams.reporter);
        const outputPath = join(inputParams.output, inputParams.testName ? inputParams.testName : 'report');

        await report(outputPath, performanceResult);
    }
    catch (error) {
        console.log(error);
        return -1;
    }

    return 0;
})();
