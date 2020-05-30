const withReset = (color: string) => `${color}%s\x1b[0m`;

const colors = {
    report: withReset("\x1b[32m"),
    trace: withReset("\x1b[34m")
}

export const report = (message: string) => console.log(colors.report, `prefrunner: ${message}`);
export const trace = (message: string) => console.log(colors.trace, `prefrunner.trace: ${message}`);