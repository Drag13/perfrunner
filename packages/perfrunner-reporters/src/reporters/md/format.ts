import { Metrics } from './metrics';

type MdViewModel = Record<Metrics, string> & { ts: string };
type MdData = Record<Metrics, number> & { ts: number };

const renderDiff = (diff: number) => (diff > 0 ? ` (+${diff})` : diff < 0 ? ` (${diff})` : '');

const toDiff = <T>(seq: T[], i: number, getValue: (v: T) => number) =>
    `${getValue(seq[i])}${i === 0 ? `` : `${renderDiff(getValue(seq[i]) - getValue(seq[i - 1]))}`}`;

export const createViewModel = (data: MdData[]): MdViewModel[] =>
    data.map((el, i) => ({
        fcp: toDiff(data, i, (v) => v.fcp),
        lcp: toDiff(data, i, (v) => v.lcp),
        domInteractive: toDiff(data, i, (v) => v.domInteractive),
        scriptDuration: toDiff(data, i, (v) => v.scriptDuration),
        layoutDuration: toDiff(data, i, (v) => v.layoutDuration),
        recalculateStyleDuration: toDiff(data, i, (v) => v.recalculateStyleDuration),
        ts: new Date(el.ts).toLocaleString(),
    }));
