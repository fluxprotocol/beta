import { EscrowStatus } from '@fluxprotocol/amm-sdk/dist/models/EscrowStatus';
import React, { ReactElement } from 'react';
import Button from '../../components/Button';
import { MarketViewModel } from '../../models/Market';
import { PoolToken } from '../../models/PoolToken';
import { formatCollateralToken } from '../../services/CollateralTokenService';
import trans from '../../translation/trans';

import s from './ClaimEarnings.module.scss';
import FinalizedMarketOutcomes from './components/FinalizedMarketOutcomes';
import { calculatePayout } from './services/calculatePayout';

interface Props {
    poolToken?: PoolToken;
    market: MarketViewModel;
    escrowStatus: EscrowStatus[];
    onClaim: () => void;
}

export default function ClaimFees({
    poolToken,
    market,
    escrowStatus,
    onClaim,
}: Props): ReactElement {
    const payout = calculatePayout(market.outcomeTokens, market.payoutNumerator, escrowStatus, poolToken);

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

            {!market.claim && !market.invalid && (
                <p>
                    {trans('market.claimEarnings.label.claimable', {
                        tokenName: market.collateralToken.tokenSymbol,
                    })}
                    <span className={s.claimable}>
                        {formatCollateralToken(payout.toString(), market.collateralToken.decimals, 8)} {market.collateralToken.tokenSymbol}
                    </span>
                </p>
            )}

            <Button disabled={Boolean(market.claim)} onClick={onClaim} className={s.confirm}>
                {trans('market.action.claimEarnings')}
            </Button>
        </div>
    );
}
