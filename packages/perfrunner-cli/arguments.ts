import cmd from "command-line-args";
import validate from "./validation";
import { params, CliParams } from "./params";

export default () => {
    const args = cmd(params, { camelCase: true }) as Partial<CliParams>;
    const validation = validate(args);

    if (validation) {
        throw new Error(`Argument validation failed: \r\n\ ${Object.entries(validation).reduce((s, [k, err]) => s += `"${k}": "${err}"\r\n`, '')}`);
    }

    return args as CliParams;
}