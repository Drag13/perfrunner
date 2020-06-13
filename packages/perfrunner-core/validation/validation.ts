import { object, boolean, Schema, string, number, lazy, array } from "yup";
import { PerfRunnerOptions } from "../index";

type ValidationScheme = {
    [key in keyof PerfRunnerOptions]: Schema<PerfRunnerOptions[key]>;
};

const optionalString = () => string().optional().strict(true);
const requiredString = () => string().required().strict(true);
const optionalBool = (defaultValue?: boolean) => boolean().optional().strict(true).default(!!defaultValue);
const optionalPositiveInteger = () => number().optional().strict(true).positive().integer();
const requiredPositiveInteger = () => number().required().strict(true).positive().integer();

const optionsValidationScheme: ValidationScheme = {
    url: requiredString().url(),
    runs: requiredPositiveInteger(),
    network: object().required().shape({
        downloadThroughput: number().required().strict(true),
        latency: number().required().strict(true),
        uploadThroughput: number().required().strict(true)
    }),
    throttlingRate: number().required().positive().integer(),
    testName: optionalString(),
    comment: optionalString(),
    output: requiredString(),
    headless: optionalBool(true),
    purge: optionalBool(),
    reportOnly: optionalBool(),
    ignoreDefaultArgs: optionalBool(),
    useCache: optionalBool(),
    chromeArgs: array().of(requiredString()),
    timeout: requiredPositiveInteger(),
    waitFor: lazy(value => {
        switch (typeof value) {
            case 'number': return optionalPositiveInteger();
            case 'string': return optionalString();
            default: return optionalString()
        }
    })
}

export default object().shape(optionsValidationScheme)
