(function (w) {

    type ChartData = {
        fcp: number[],
        fp: number[],
        labels: string[],
    }

    class EntriesChartReporter implements IReporterPlugin<IChartOptions> {
        name = 'entries';
        type: 'chart' = 'chart';

        render(container: HTMLElement, data: IPerformanceResult, _: IUtils, defaultOptions?: Chart.ChartOptions | undefined): void {
            const canvas = container as HTMLCanvasElement;

            if (canvas == null || typeof canvas.getContext !== 'function') {
                throw new Error(`EntriesChartReporter failed, provided container is not canvs`)
            }

            const viewData = this.transform(data);
            const comments = this.getComments(data);
            const ctx = canvas.getContext('2d')!;

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: viewData.labels,
                    datasets: [
                        {
                            label: 'First Contentful Paint',
                            data: viewData.fcp,
                            borderColor: '#3f681C',
                            borderWidth: 2,
                            backgroundColor: 'rgba(0, 0, 0, 0.0)',
                        },
                        {
                            label: "First Paint",
                            data: viewData.fp,
                            borderColor: '#FFBB00',
                            borderWidth: 2,
                            backgroundColor: 'rgba(0, 0, 0, 0.0)',
                        }
                    ]
                },
                options: {
                    ...defaultOptions,
                    tooltips: {
                        callbacks: {
                            afterBody: (t) => {
                                const index = t[0].index;
                                return index == null || index >= comments.length ? '' : comments[index] ?? '';
                            },
                            label: (t, d) => { return `${d.datasets![t.datasetIndex!].label}: ${d.datasets![t.datasetIndex!].data![t.index!]}ms` }
                        }
                    }
                }
            });
        }

        transform(rawData: IPerformanceResult): ChartData {
            if (!Array.isArray(rawData)) {
                throw new Error('data is not in array format')
            };

            return rawData.reduce((acc, v, i) => {
                const fcpEvent = v.performanceEntries.find(x => x.name === 'first-contentful-paint');
                acc.fcp.push(fcpEvent ? fcpEvent.startTime : 0);

                const fpEvent = v.performanceEntries.find(x => x.name === 'first-paint');
                acc.fp.push(fpEvent ? fpEvent.startTime : 0);

                acc.labels.push(`#${i + 1}`);

                return acc;
            }, {
                fcp: [] as number[],
                fp: [] as number[],
                labels: [] as string[],
            });
        }

        private getComments(rawData: IPerformanceResult): string[] {
            return rawData.map(x => x.comment ?? '');
        }

    }

    w.renderer.registerPlugin(new EntriesChartReporter());
})(window);