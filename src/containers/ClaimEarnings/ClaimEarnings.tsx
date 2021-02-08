import React, { ReactElement } from 'react';
import Button from '../../components/Button';
import { MarketViewModel } from '../../models/Market';
import trans from '../../translation/trans';

import s from './ClaimEarnings.module.scss';
import FinalizedMarketOutcomes from './components/FinalizedMarketOutcomes';

interface Props {
    market: MarketViewModel;
    onClaim: () => void;
}

export default function ClaimFees({
    market,
    onClaim,
}: Props): ReactElement {
    return (
        <div>
            {market.invalid && (
                <p>{trans('market.claimEarnings.invalidMarket')}</p>
            )}

            {!market.invalid && (
                <>
                    <p>
                        {trans('market.claimEarnings.validMarket')}
                    </p>
                    <FinalizedMarketOutcomes market={market} />
                </>
            )}

            {market.claim && (
                <p>
                    {trans('market.claimEarnings.alreadyClaimed', {
                        payout: market.claim.payoutFormatted,
                        tokenName: market.collateralToken.tokenName,
                    })}
                </p>
            )}

            <Button disabled={Boolean(market.claim)} onClick={onClaim} className={s.confirm}>
                {trans('market.action.claimEarnings')}
            </Button>
        </div>
    );
}
