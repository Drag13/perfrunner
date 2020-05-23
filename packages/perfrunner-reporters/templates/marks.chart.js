(function () {

    const colors = [
        `rgba(50, 50, 50, 1)`,
        `rgba(50, 50, 100, 1)`,
        `rgba(50, 50, 150, 1)`,
        `rgba(50, 50, 200, 1)`,
        `rgba(50, 50, 250, 1)`,
    ];

    function transform(rawData) {
        if (!Array.isArray(data)) {
            throw new Error('data is not in array format')
        };

        return rawData.reduce((acc, v, i) => {
            const marks = v.performanceEntries.filter(x => x.entryType === 'mark');

            marks.forEach((m) => {
                const name = m.name;
                const startTime = m.startTime;

                if (!acc[name]) {
                    acc[name] = []
                }

                acc[name].push(startTime);
            });

            acc.labels.push(`#${i}`);

            return acc;
        }, {
            labels: []
        });
    }

    function toDataSet(viewData) {
        return Object.entries(viewData).filter(([key]) => key !== 'labels').map(([key, entries], i) => ({
            label: key,
            data: entries,
            borderColor: colors[i],
            backgroundColor: 'rgba(0, 0, 0, 0.0)',
            borderWidth: 1
        }));
    }

    function render(canvasId, rawData, options) {
        const viewData = transform(rawData);
        var ctx = document.getElementById(canvasId).getContext('2d');
        const datasets = toDataSet(viewData);
        console.log(datasets);


        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: viewData.labels,
                datasets
            },
            options
        });

        return chart;
    }
    window.marksChart = {
        render
    }
})();