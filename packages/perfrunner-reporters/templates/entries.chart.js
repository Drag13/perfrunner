(function () {
    function transform(rawData) {
        if (!Array.isArray(data)) {
            throw new Error('data is not in array format')
        };

        return rawData.reduce((acc, v, i) => {
            const fcpEvent = v.performanceEntries.find(x => x.name === 'first-contentful-paint');
            acc.fcp.push(fcpEvent.startTime);
            acc.labels.push(`#${i}`);

            return acc;
        }, {
            fcp: [],
            labels: []
        });
    }

    function render(canvasId, rawData, options) {
        const viewData = transform(rawData);
        var ctx = document.getElementById(canvasId).getContext('2d');

        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: viewData.labels,
                datasets: [{
                    label: 'layoutDuration',
                    data: viewData.fcp,
                    borderColor: 'rgba(255, 99, 60, 1)',
                    backgroundColor: 'rgba(0, 0, 0, 0.0)',
                    borderWidth: 1
                }]
            },
            options
        });

        return chart;
    }

    window.entriesChart = {
        render
    }
}());