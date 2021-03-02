import React, { useEffect, useRef } from 'react';
import { ReactElement } from 'react';
import { PriceHistoryData } from '../../models/PriceHistoryData';
import { useDarkmode } from '../../utils/darkmode';
import generateLineChart, { generateChartData } from './utils/generateLineChart';

interface Props {
    pricesHistory: PriceHistoryData[];
    isScalar: boolean;
}


export default function LineChart({
    pricesHistory,
    isScalar,
}: Props): ReactElement {
    const canvas = useRef<HTMLCanvasElement>(null);
    const isDarkmodeActive = useDarkmode();
    const chart = useRef<Chart | null>(null);

    useEffect(() => {
        if (!canvas.current) {
            return;
        }

        chart.current = generateLineChart(canvas.current);
    }, [canvas, isDarkmodeActive]);

    useEffect(() => {
        if (!chart.current) return;

        chart.current.data = generateChartData(pricesHistory, isScalar);
        chart.current.update();
    }, [chart, pricesHistory, isDarkmodeActive, isScalar]);

    return (
        <canvas ref={canvas} />
    );
}
