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

/**
 * Logs message with default level
 * @param message message to log
 */
export const log = (message: string) => console.log(colors.log, `prefrunner: ${message}`);

/**
 * Logs debug messages
 * @param message message to log
 */
export const debug = (message: string) => isVerbose() && console.log(colors.debug, `prefrunner.debug: ${message}`);

/**
 * Logs error
 * @param error error message to log
 */
export const error = (error: string | Error) => {
    if (error instanceof Error) {
        console.log(colors.error, `perfrunner: ${error.message}`);
        error.stack && console.log(error.stack);
    } else {
        console.log(colors.error, `perfrunner: ${error}`);
    }
};
