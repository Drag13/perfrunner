export const toMs = (v: number) => v == null || isNaN(v) ? `` : `${Math.round(v)} ms`;

export const toBytes = (bytes: number) => {

    /**Credits goes here: https://web.archive.org/web/20120507054320/http://codeaid.net/javascript/convert-size-in-bytes-to-human-readable-format-(javascript) */

    if (bytes === 0) { return '0 Bytes'; }

    const isNegative = bytes < 0;

    if (isNegative) { bytes = bytes * -1; }

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${isNegative ? '-' : ''}${parseFloat((bytes / Math.pow(k, i)).toFixed(0))} ${sizes[i]}`;
}