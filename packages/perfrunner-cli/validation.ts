import { CliParams } from './params';

type ValidationResult = {
    [key in keyof CliParams]?: string;
} | null;

export default (args: Partial<CliParams>): ValidationResult => {
    const result: ValidationResult = {};
    let valid = true;

    if (!args.url) {
        valid = false;
        result.url = `Url is required`;
    }

    return valid ? null : result;
}