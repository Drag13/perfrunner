export const setupLogLevel = (logLevel: string | undefined) => {
    if (logLevel) {
        process.env.LOG_LEVEL = logLevel;
    }
};
