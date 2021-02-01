import React, { ReactElement, useCallback } from 'react';
import { useSelector } from 'react-redux';
import LiquidityProvider from '../../containers/LiquidityProvider';
import { LiquidityProviderFormValues } from '../../containers/LiquidityProvider/services/validateLiquidityProviderFormValues';
import { Reducers } from '../../redux/reducers';
import { joinPool } from '../../services/PoolService';


export default function LiquidityProviderConnector(): ReactElement {
    const market = useSelector((store: Reducers) => store.market.marketDetail);

    const onJoinPool = useCallback((formValues: LiquidityProviderFormValues) => {
        if (!market) return;

        joinPool(market.id, formValues.liquidityAmountIn, market.collateralTokenId);
    }, [market]);

    if (!market) {
        return <div />
    }

    return (
        <LiquidityProvider
            token={market.collateralToken}
            onSubmit={onJoinPool}
        />
    );
}
