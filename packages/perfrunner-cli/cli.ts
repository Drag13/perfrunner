#!/usr/bin/env node

import cmd from "command-line-args";
import { params, CliParams } from "./params";
import { profile, PerfRunnerOptions } from "perfrunner-core";

(async function () {
    const inputParams = cmd(params, { camelCase: true }) as CliParams;
    const profileParams: PerfRunnerOptions = { ...inputParams, useCache: inputParams.cache, throttlingRate: inputParams.throttling };
    const performanceResult = await profile(profileParams);
    const reporters = await import('perfrunner-reporters');
    const reporter = reporters.report;
    reporter('./test.json', performanceResult);
})();
