(function () {
    function transform(rawData: IPerformanceResult) {
        if (!Array.isArray(rawData)) {
            throw new Error('data is not in array format')
        };

        return rawData.reduce((acc, v, i) => {
            const fcpEvent = v.performanceEntries.find((x: any) => x.name === 'first-contentful-paint');
            acc.fcp.push(fcpEvent ? fcpEvent.startTime : 0);
            acc.labels.push(`#${i + 1}`);

            return acc;
        }, {
            fcp: [] as number[],
            labels: [] as string[]
        });
    }

    function render(canvasId: string, rawData: any, options: any) {
        const viewData = transform(rawData);
        const ctx = (document.getElementById(canvasId) as HTMLCanvasElement)?.getContext('2d');

        if (ctx == null) {
            console.warn(`Canvas with id: ${canvasId} not found`)
            return;
        }

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: viewData.labels,
                datasets: [{
                    label: 'first-contentful-paint',
                    data: viewData.fcp,
                    borderColor: 'rgba(255, 99, 60, 1)',
                    borderWidth: 1
                }]
            },
            options
        });
    }

    (window as any).entriesChart = {
        render
    }
}());