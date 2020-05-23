import cmd from "command-line-args";
import validate from "./validation/validation";
import { params, CliParams } from "./options/options";

export default () => {
    const args = cmd(params, { camelCase: true }) as Partial<CliParams>;
    const validation = validate(args);

    if (validation.invalid) {
        console.error(`Argument validation failed: \r\n\ ${validation}`)
        throw new Error(`Validation Failed`);
    }

    return args as CliParams;
}