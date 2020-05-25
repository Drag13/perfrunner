import { IPerformanceResult } from "../../perfrunner-core/db/scheme";

(function () {
    function transform(rawData: IPerformanceResult) {
        if (!Array.isArray(rawData)) {
            throw new Error('data is not in array format')
        };

        return rawData.reduce((acc, v, i) => {
            const fcpEvent = v.performanceEntries.find(x => x.name === 'first-contentful-paint');
            acc.fcp.push(fcpEvent!.startTime);
            acc.labels.push(`#${i + 1}`);

            return acc;
        }, {
            fcp: [] as number[],
            labels: [] as string[]
        });
    }

    function render(canvasId: string, rawData: IPerformanceResult, options: any) {
        const viewData = transform(rawData);
        const ctx = (document.getElementById(canvasId) as HTMLCanvasElement)?.getContext('2d');

        if (ctx == null) {
            console.warn(`Canvas with id: ${canvasId} not found`)
            return;
        }

        var ch = new Chart(ctx);
        ch.Line(
            {
                labels: viewData.labels,
                datasets: [{
                    label: 'first-contentful-paint',
                    data: viewData.fcp,
                    borderColor: 'rgba(255, 99, 60, 1)',
                    fillColor: 'rgba(0, 0, 0, 0.0)',
                    strokeColor: 'rgba(66, 66, 66, 0.0)'
                }]
            },
            options
        )
    }

    (window as any).entriesChart = {
        render
    }
}());