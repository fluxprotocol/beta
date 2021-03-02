import Skeleton from '@material-ui/lab/Skeleton';
import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ANALYTICS_STORAGE_KEY } from '../../config';
import MarketStatistics from '../../containers/MarketStatistics';
import { fetchPricesHistoryByMarketId } from '../../redux/priceHistory/priceHistoryActions';
import { Reducers } from '../../redux/reducers';
import { Period } from '../../services/PricesHistoryService';
import { usePrevious } from '../../utils/hooks/usePrevious';

const PRICE_HISTORY_INTERVAL_MS = 2000;
interface Props {
    className?: string;
}

export default function MarketStatisticsConnector({
    className = '',
}: Props) {
    const pricesHistory = useSelector((store: Reducers) => store.priceHistory.pricesHistory);
    const market = useSelector((store: Reducers) => store.market.marketDetail);
    const previousMarket = usePrevious(market);
    const intervalId = useRef<NodeJS.Timeout>();
    const [period, setPeriod] = useState<Period | null>(localStorage.getItem(ANALYTICS_STORAGE_KEY) as Period);
    const dispatch = useDispatch();

    function handlePeriodChange(period: Period) {
        if (!market) throw new Error('ERR_NO_MARKET');
        localStorage.setItem(ANALYTICS_STORAGE_KEY, period);
        setPeriod(period);

        // @ts-ignore
        clearInterval(intervalId.current);
        dispatch(fetchPricesHistoryByMarketId(market, period));

        intervalId.current = setInterval(() => {
            dispatch(fetchPricesHistoryByMarketId(market, period));
        }, PRICE_HISTORY_INTERVAL_MS);
    }

    useEffect(() => {
        return () => {
            // @ts-ignore
            clearInterval(intervalId.current);
        }
    }, []);

    useEffect(() => {
        if (!market) return;
        if (market.id === previousMarket?.id) return;

        // @ts-ignore
        clearInterval(intervalId.current);
        dispatch(fetchPricesHistoryByMarketId(market, period || undefined));

        intervalId.current = setInterval(() => {
            dispatch(fetchPricesHistoryByMarketId(market, period || undefined));
        }, PRICE_HISTORY_INTERVAL_MS);
    }, [market, dispatch]);

    if (!market) {
        return <Skeleton height={500} />;
    }

    return (
        <MarketStatistics
            pricesHistory={pricesHistory}
            className={className}
            onPeriodChange={handlePeriodChange}
            period={period || undefined}
            market={market}
        />
    );
}
