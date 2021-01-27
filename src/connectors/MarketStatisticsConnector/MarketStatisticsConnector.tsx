import React, { ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MarketStatistics from '../../containers/MarketStatistics';
import { fetchPricesHistoryByMarketId } from '../../redux/priceHistory/priceHistoryActions';
import { Reducers } from '../../redux/reducers';
import { Period } from '../../services/PricesHistoryService';

interface Props {
    className?: string;
}

export default function MarketStatisticsConnector({
    className = '',
}: Props): ReactElement {
    const pricesHistory = useSelector((store: Reducers) => store.priceHistory.pricesHistory);
    const market = useSelector((store: Reducers) => store.market.marketDetail);
    const dispatch = useDispatch();

    function handlePeriodChange(period: Period) {
        if (!market) throw new Error('ERR_NO_MARKET');

        dispatch(fetchPricesHistoryByMarketId(market.id, period));
    }

    return (
        <MarketStatistics
            pricesHistory={pricesHistory}
            className={className}
            onPeriodChange={handlePeriodChange}
        />
    );
}
