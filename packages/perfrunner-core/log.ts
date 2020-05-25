const withReset = (color: string) => `${color}%s\x1b[0m`;

const colors = {
    report: withReset("\x1b[35m"),
}

export const report = (message: string) => console.log(colors.report, message)