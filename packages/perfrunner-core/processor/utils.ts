export const groupEntries = (rawPerformanceData: PerformanceEntry[][]): PerformanceEntry[][] => {

    const runs = rawPerformanceData;

    const combined = runs[0].reduce((result, pEntry) => {
        const sameEntries = runs.reduce((acc, v) => {
            const same = v.find((x) => x.entryType === pEntry.entryType && x.name === pEntry.name);
            same && acc.push(same);
            return acc;
        }, []);

        result.push(sameEntries);

        return result;
    }, [] as PerformanceEntry[][])

    return combined;
}
