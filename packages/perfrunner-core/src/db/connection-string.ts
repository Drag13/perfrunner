export type ConnectionString = string;

const hex = (x: number) => x.toString(16);

function hash(text: string) {
    let hash = 0;
    let chr: number;

    for (let i = 0; i < text.length; i++) {
        chr = text.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0;
    }

    return hash;
}

function generateReportName(url: URL): string {
    const meaningfulUrl = `${url.protocol}//${url.host}${url.pathname.endsWith('/') ? url.pathname : url.pathname + '/'}`;
    const hashedUrl = hash(meaningfulUrl);
    const fileName = hex(hashedUrl);

    return fileName;
}

export const getConnectionString = (outputFolder: string, url: URL, testName?: string): ConnectionString => {
    return `${outputFolder}/${testName ?? generateReportName(url)}.json`;
};
