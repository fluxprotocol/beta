import React, { ReactElement, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
}: Props): ReactElement {
    const pricesHistory = useSelector((store: Reducers) => store.priceHistory.pricesHistory);
    const market = useSelector((store: Reducers) => store.market.marketDetail);
    const previousMarket = usePrevious(market);
    const intervalId = useRef<NodeJS.Timeout>();
    const dispatch = useDispatch();

    function handlePeriodChange(period: Period) {
        if (!market) throw new Error('ERR_NO_MARKET');

        // @ts-ignore
        clearInterval(intervalId.current);
        dispatch(fetchPricesHistoryByMarketId(market.id, period));

        intervalId.current = setInterval(() => {
            dispatch(fetchPricesHistoryByMarketId(market.id, period));
        }, PRICE_HISTORY_INTERVAL_MS);
    }

    useEffect(() => {
        if (!market) return;
        if (market.id === previousMarket?.id) return;

        // @ts-ignore
        clearInterval(intervalId.current);
        dispatch(fetchPricesHistoryByMarketId(market.id));

        intervalId.current = setInterval(() => {
            dispatch(fetchPricesHistoryByMarketId(market.id));
        }, PRICE_HISTORY_INTERVAL_MS);

        return () => {
            // @ts-ignore
            clearInterval(intervalId.current);
        };
    }, [market, dispatch]);

    return (
        <MarketStatistics
            pricesHistory={pricesHistory}
            className={className}
            onPeriodChange={handlePeriodChange}
        />
    );
}
