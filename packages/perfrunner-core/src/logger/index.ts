export const LOG_LEVEL = {
    VERBOSE: 'verbose',
};

const withReset = (color: string) => `${color}%s\x1b[0m`;

const colors = {
    log: withReset('\x1b[32m'),
    debug: withReset('\x1b[34m'),
    error: withReset('\x1b[31m'),
};

const isVerbose = (): boolean => process.env.LOG_LEVEL === LOG_LEVEL.VERBOSE;

export const log = (message: string) => console.log(colors.log, `prefrunner: ${message}`);
export const debug = (message: string) => isVerbose() && console.log(colors.debug, `prefrunner.debug: ${message}`);
export const error = (message: string) => console.log(colors.error, `perfrunner: ${message}`);