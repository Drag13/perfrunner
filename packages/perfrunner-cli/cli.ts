#!/usr/bin/env node

import { profile, PerfRunnerOptions } from "perfrunner-core";
import cmd from "./cmd";
import { loader } from "./utils/reporter-loader";

(async function () {
    const inputParams = cmd();
    const profileParams: PerfRunnerOptions = { ...inputParams, useCache: inputParams.cache, throttlingRate: inputParams.throttling, headless: !inputParams.noHeadless };

    const performanceResult = await profile(profileParams);
    const report = await loader(inputParams.reporter);
    await report(inputParams.output, performanceResult);
})();
