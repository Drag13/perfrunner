#!/usr/bin/env node

import { profile, PerfRunnerOptions } from "perfrunner-core";
import getApplicationParams from "./arguments";
import { loader } from "./reporter-loader";

(async function () {
    const inputParams = getApplicationParams();
    const profileParams: PerfRunnerOptions = { ...inputParams, useCache: inputParams.cache, throttlingRate: inputParams.throttling };
    const performanceResult = await profile(profileParams);
    const report = await loader(inputParams.reporter);
    report(inputParams.output, performanceResult);
})();
