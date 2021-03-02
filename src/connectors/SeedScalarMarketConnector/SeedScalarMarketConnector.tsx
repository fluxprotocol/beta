import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SeedScalarMarket from '../../containers/SeedScalarMarket';
import { seedScalarMarketAction } from '../../redux/market/marketActions';
import { Reducers } from '../../redux/reducers';
import { SeedScalarMarketFormValues } from '../../services/PoolService';


export default function SeedScalarMarketConnector() {
    const market = useSelector((store: Reducers) => store.market.marketDetail);
    const dispatch = useDispatch();

    const handleSubmit = useCallback((values: SeedScalarMarketFormValues) => {
        if (!market) return;
        dispatch(seedScalarMarketAction(market, values));
    }, [dispatch, market]);

    if (!market) return null;

    return (
        <SeedScalarMarket
            market={market}
            onSubmit={handleSubmit}
        />
    );
}
