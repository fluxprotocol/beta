import React, { ReactElement, useCallback } from 'react';
import { useSelector } from 'react-redux';
import ClaimEarnings from '../../containers/ClaimEarnings';
import { Reducers } from '../../redux/reducers';
import { claimEarningsForMarket } from '../../services/MarketService';


export default function ClaimEarningsConnector(): ReactElement {
    const market = useSelector((store: Reducers) => store.market.marketDetail);
    const poolToken = useSelector((store: Reducers) => store.market.poolTokenBalance);
    const escrowStatus = useSelector((store: Reducers) => store.market.escrowStatus);

    const handleClaim = useCallback(() => {
        if (!market) return;

        claimEarningsForMarket(market.id);
    }, [market]);

    if (!market) {
        return (
            <div />
        );
    }

    return (
        <ClaimEarnings
            poolToken={poolToken}
            market={market}
            onClaim={handleClaim}
            escrowStatus={escrowStatus}
        />
    );
}
