(function () {
    function transform(data) {

        if (!Array.isArray(data)) {
            throw new Error('data is not in array format')
        };

        const viewData = data.reduce((acc, v, i) => {
            acc.layoutDuration.push(v.pageMetrics.LayoutDuration);
            acc.recalcStyleDuration.push(v.pageMetrics.RecalcStyleDuration);
            acc.scriptDuration.push(v.pageMetrics.ScriptDuration);
            acc.labels.push(`#${i+1}`);
            return acc;
        }, {
            layoutDuration: [],
            recalcStyleDuration: [],
            scriptDuration: [],
            labels: []
        });

        return viewData;
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
                        data: viewData.layoutDuration,
                        borderColor: ['rgba(255, 99, 60, 1)', ],
                        backgroundColor: ['rgba(0, 0, 0, 0.0)', ],
                        borderWidth: 1
                    },
                    {
                        label: 'recalcStyleDuration',
                        data: viewData.recalcStyleDuration,
                        borderColor: ['rgba(255, 0, 60, 1)', ],
                        backgroundColor: ['rgba(0, 0, 0, 0.0)'],
                        borderWidth: 1
                    },
                    {
                        label: 'scriptDuration',
                        data: viewData.scriptDuration,
                        borderColor: ['rgba(255, 5, 60, 1)', ],
                        backgroundColor: ['rgba(0, 0, 0, 0.0)', ],
                        borderWidth: 1
                    }
                ]
            },
            options
        });

        return chart;
    }

    window.metricsChart = {
        render
    }
})();