import Chart from 'chart.js';
import { PriceHistoryData } from '../../../models/PriceHistoryData';
import { getColorForOutcome } from '../../../utils/getColorForOutcome';
import getCssVariableValue from '../../../utils/getCssVariableValue';

export function generateChartData(priceHistoryData: PriceHistoryData[]): Chart.ChartData {
    const outcomeData: Map<number, number[]> = new Map();

    priceHistoryData.forEach((historyData) => {
        historyData.dataPoints.forEach((outcomePriceData) => {
            const outcomeDataPoints = outcomeData.get(outcomePriceData.outcome);

            if (Array.isArray(outcomeDataPoints)) {
                outcomeDataPoints.push(Number(outcomePriceData.price) * 100);
            } else {
                outcomeData.set(outcomePriceData.outcome, [Number(outcomePriceData.price) * 100]);
            }
        });
    });

    const dataSets: Chart.ChartDataSets[] = [];

    outcomeData.forEach((data, outcomeId) => {
        dataSets.push({
            data,
            fill: false,
            borderWidth: 2,
            borderColor: `${getCssVariableValue(getColorForOutcome(outcomeId))}`,
            cubicInterpolationMode: 'monotone',
        });

        // Dotted line for latest price
        dataSets.push({
            data: new Array(data.length).fill(data[data.length - 1]),
            fill: false,
            borderWidth: 1,
            borderColor: `${getCssVariableValue(getColorForOutcome(outcomeId))}`,
            borderDash: [2, 5],
            cubicInterpolationMode: 'monotone',
        });
    });

    return {
        labels: priceHistoryData.map(point => point.pointKey),
        datasets: dataSets,
    };
}

export default function generateLineChart(canvas: HTMLCanvasElement): Chart | null {
    const context = canvas.getContext('2d');
    if (!context) return null;

    const chart = new Chart(context, {
        type: 'line',

        options: {
            responsive: true,

            legend: {
                display: false,
            },

            elements:{
                line: {
                    tension: 0,
                },
                point: {
                    // radius: 0,
                }
            },

            scales: {
                yAxes: [{
                    type: 'linear',
                    gridLines: {
                        color: '#d8d8d8',
                        drawOnChartArea: false,
                        drawTicks: false,
                    },
                    ticks: {
                        fontColor: 'white',
                        min: 0,
                        max: 100,
                        maxTicksLimit: 6,
                        stepSize: 25,
                        padding: 10,
                        callback: (value) => (Number(value) / 100).toFixed(2),
                    }
                }],
                xAxes: [{
                    gridLines: {
                        color: '#d8d8d8',
                        drawOnChartArea: false,
                        drawTicks: false,
                    },
                    ticks: {
                        fontColor: 'white',
                        padding: 10,
                    }
                }],
            },
        },
    });

    return chart;
}

