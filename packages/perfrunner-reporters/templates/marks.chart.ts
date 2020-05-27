(function () {

    type ViewData = Record<string, any[]>;

    const colors = [
        `#375E97`,
        `#FB6542`,
        `#FFBB00`,
        `#3f681C`,
        `#000000`,
    ];

    function transform(rawData: IPerformanceResult) {
        if (!Array.isArray(rawData)) {
            throw new Error('data is not in array format')
        };

        const result: ViewData = {
            labels: []
        }

        return rawData.reduce((acc, v, i) => {
            const marks = v.performanceEntries.filter(x => x.entryType === 'mark');

            marks.forEach((m) => {
                const name = m.name;
                const startTime = m.startTime;

                if (acc[name] == null) {
                    acc[name] = []
                }
                acc[name].push(startTime);
            });

            acc.labels.push(`#${i + 1}`);

            return acc;
        }, result);
    }

    function toDataSet(viewData: ViewData) {
        return Object.entries(viewData).filter(([key]) => key !== 'labels').map(([key, entries], i) => ({
            label: key,
            data: entries,
            borderColor: colors[i],
            backgroundColor: 'rgba(0, 0, 0, 0.0)',
            borderWidth: 2
        }));
    }

    function render(canvasId: string, rawData: IPerformanceResult, options: Chart.ChartOptions) {
        const viewData = transform(rawData);
        var ctx = (document.getElementById(canvasId) as HTMLCanvasElement)?.getContext('2d');

        if (ctx == null) {
            console.warn(`Canvas with id: ${canvasId} not found`)
            return;
        }

        const datasets = toDataSet(viewData);

        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: viewData.labels,
                datasets
            },
            options: { ...options, tooltips: { callbacks: { title: () => 'Hello', footer: () => 'I AM FOOTER' } } }
        });

        return chart;
    }
    (window as any).marksChart = {
        render
    }
})();