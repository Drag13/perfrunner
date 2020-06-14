const withReset = (color: string) => `${color}%s\x1b[0m`;

const colors = {
    log: withReset('\x1b[32m'),
    debug: withReset('\x1b[34m'),
    error: withReset('\x1b[31m'),
};

export const log = (message: string) => console.log(colors.log, `prefrunner: ${message}`);
export const debug = (message: string) => console.log(colors.debug, `prefrunner.debug: ${message}`);
export const throwException = (message: string) => {
    throw `\x1b[31m${message}\x1b[0m`;
};
