const generateChartContainer = () => `<div class="chart-container"><canvas></canvas> </div>`;
const generateChartRow = (charts: string) => `<div class="charts">${charts}</div>`;

export const renderPlacholdersForCharts = (numberOfCharts: number) => {
    let charts = ``;

    for (let i = 0; i < numberOfCharts; i++) {
        charts += generateChartContainer();
    }

    return generateChartRow(charts);
};
