#!/usr/bin/env node

import cmd from "command-line-args";
import { params, CliParams } from "./options/options";
import { resolve } from "path";
import { profile } from "perfrunner-core";
import { loader } from "./utils/reporter-loader";

(async function (): Promise<number> {

    const inputParams = cmd(params, { camelCase: true }) as CliParams;

    try {

        const performanceResult = await profile({
            ...inputParams,
            useCache: inputParams.cache,
            throttlingRate: inputParams.throttling,
            headless: !inputParams.noHeadless
        });

        const report = await loader(inputParams.reporter);
        const outputPath = resolve(__dirname, inputParams.output, inputParams.testName ? inputParams.testName : 'report');

        await report(outputPath, performanceResult);
    }
    catch (error) {
        console.log(`\x1b[31m${error}\x1b[0m`);
        return -1;
    }

    return 0;
})();
