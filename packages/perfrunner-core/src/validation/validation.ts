import { object, boolean, Schema, string, number, lazy, array } from 'yup';
import { PerfRunnerOptions } from '../index';
import { error } from '../logger';

type ValidationScheme = {
    [key in keyof PerfRunnerOptions]: Schema<PerfRunnerOptions[key]>;
};

// yup doesn't validate localhost as correct URL
// https://github.com/jquense/yup/issues/224
const urlRegex = /^(?:([a-z0-9+.-]+):\/\/)(?:\S+(?::\S*)?@)?(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/;

const optionalString = () => string().optional().strict(true);
const requiredString = () => string().required().strict(true);
const optionalBool = (defaultValue?: boolean) => boolean().optional().strict(true).default(!!defaultValue);
const optionalPositiveInteger = () => number().optional().strict(true).positive().integer();
const requiredPositiveInteger = () => number().required().strict(true).positive().integer();

const optionsValidationScheme: ValidationScheme = {
    url: requiredString().test('url', 'URL isn\t valid', (v): boolean => v == null || urlRegex.test(v)),
    runs: requiredPositiveInteger(),
    network: object()
        .required()
        .shape({
            downloadThroughput: number().required().strict(true),
            latency: number().required().strict(true),
            uploadThroughput: number().required().strict(true),
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
    waitFor: lazy((value) => {
        switch (typeof value) {
            case 'number':
                return optionalPositiveInteger();
            case 'string':
                return optionalString();
            default:
                return optionalString();
        }
    }),
    executablePath: optionalString(),
};

export const validator = object().shape(optionsValidationScheme);

export function validateArguments(params: PerfRunnerOptions) {
    try {
        validator.validateSync(params);
    } catch (e) {
        error(e);
        throw e;
    }
}
