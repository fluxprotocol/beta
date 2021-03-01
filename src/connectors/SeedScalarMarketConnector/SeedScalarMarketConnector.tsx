import React from 'react';
import { useSelector } from 'react-redux';
import SeedScalarMarket from '../../containers/SeedScalarMarket';
import { Reducers } from '../../redux/reducers';


export default function SeedScalarMarketConnector() {
    const market = useSelector((store: Reducers) => store.market.marketDetail);

    if (!market) return null;

    return (
        <SeedScalarMarket
            market={market}
        />
    );
}
