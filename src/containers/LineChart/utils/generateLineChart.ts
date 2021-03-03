import FluxSdk from '@fluxprotocol/amm-sdk';
import Big from 'big.js';
import Chart from 'chart.js';
import { MarketType, MarketViewModel } from '../../../models/Market';
import { PriceHistoryData } from '../../../models/PriceHistoryData';
import { getScalarBounds } from '../../../services/MarketService';
import { getColorForOutcome } from '../../../utils/getColorForOutcome';
import getCssVariableValue from '../../../utils/getCssVariableValue';

function generateScalarChartData(priceHistoryData: PriceHistoryData[], market: MarketViewModel): Chart.ChartData {
    const dataSets: Chart.ChartDataSets[] = [];
    const bounds = getScalarBounds(market.outcomeTokens.map(t => t.bound));

    priceHistoryData.forEach((historyData) => {
        // 1 is always the long token
        const longPriceOutcome = historyData.dataPoints.find(dp => dp.outcome === 1);
        const scalarValue = FluxSdk.utils.calcScalarValue(bounds.lowerBound, bounds.upperBound, new Big(longPriceOutcome?.price ?? 0));

        console.log('[] scalarValue -> ', scalarValue.toString());

    });

    return {
        datasets: dataSets,
    };
}

export function generateChartData(priceHistoryData: PriceHistoryData[], market: MarketViewModel): Chart.ChartData {
    const outcomeData: Map<number, number[]> = new Map();
    const dataSets: Chart.ChartDataSets[] = [];
    const isScalar = market.type === MarketType.Scalar;

    if (isScalar) return generateScalarChartData(priceHistoryData, market);

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
            hidden: false,
            pointHitRadius: 0,
            pointHoverRadius: 0,
            pointRadius: 0,
            label: '',
            hideInLegendAndTooltip: true,
        });
    });

    return {
        labels: priceHistoryData.map(point => point.pointKey),
        datasets: dataSets,
    };
}

export default function generateLineChart(canvas: HTMLCanvasElement, market: MarketViewModel): Chart | null {
    const context = canvas.getContext('2d');
    if (!context) return null;

    let min = 0;
    let max = 100;

    if (market.type === MarketType.Scalar) {
        const bounds = getScalarBounds(market.outcomeTokens.map(t => t.bound));
        min = bounds.lowerBound.toNumber();
        max = bounds.upperBound.toNumber();
    }

    console.log('[] min, max -> ', min, max);

    const chart = new Chart(context, {
        type: 'line',

        options: {
            responsive: true,

            legend: {
                display: false,
            },

            animation: {
                duration: 0,
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
                        fontColor: getCssVariableValue('--c-text'),
                        min,
                        max,
                        maxTicksLimit: 6,
                        stepSize: max / 4,
                        padding: 10,
                        callback: (value) => {
                            if (market.type === MarketType.Scalar) {
                                return value;
                            }

                            return (Number(value) / 100).toFixed(2)
                        },
                    }
                }],
                xAxes: [{
                    gridLines: {
                        color: '#d8d8d8',
                        drawOnChartArea: false,
                        drawTicks: false,
                    },
                    ticks: {
                        fontColor: getCssVariableValue('--c-text'),
                        padding: 10,
                    }
                }],
            },
        },
    });

    return chart;
}

