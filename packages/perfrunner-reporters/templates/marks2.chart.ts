
(function ({ renderer }) {

    const colors = [
        `#375E97`,
        `#FB6542`,
        `#FFBB00`,
        `#3f681C`,
        `#000000`,
    ];

    type ViewData = Record<string, any[]>;

    class CustomMarksChartReporter implements IReporterPlugin<IChartOptions> {
        name = 'marks';
        type: 'chart' = 'chart';

        render(container: HTMLElement, data: IPerformanceResult, _: IUtils, defaultOptions?: IChartOptions | undefined): void {
            const canvas = container as HTMLCanvasElement;

            if (canvas == null || typeof canvas.getContext !== 'function') {
                throw new Error(`EntriesChartReporter failed, provided container is not canvs`)
            }

            const viewData = this.transform(data);
            const datasets = this.toDataSet(viewData);
            var ctx = canvas.getContext('2d')!;

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: viewData.labels,
                    datasets
                },
                options: { ...defaultOptions, tooltips: { callbacks: { title: () => 'Hello', footer: () => 'I AM FOOTER' } } }
            });
        }

        private transform(rawData: IPerformanceResult) {
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

        private toDataSet(viewData: ViewData) {
            return Object.entries(viewData).filter(([key]) => key !== 'labels').map(([key, entries], i) => ({
                label: key,
                data: entries,
                borderColor: colors[i],
                backgroundColor: 'rgba(0, 0, 0, 0.0)',
                borderWidth: 2
            }));
        }
    }

    renderer.registerPlugin(new CustomMarksChartReporter())
})(window);
