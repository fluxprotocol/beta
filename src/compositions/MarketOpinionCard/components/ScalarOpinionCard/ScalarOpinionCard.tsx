import FluxSdk from '@fluxprotocol/amm-sdk';
import Big from 'big.js';
import React from 'react';
import { SCALAR_VALUE_DECIMALS } from '../../../../config';
import { MarketViewModel } from '../../../../models/Market';
import { formatCollateralToken } from '../../../../services/CollateralTokenService';
import { getScalarBounds, getScalarLongShortTokens } from '../../../../services/MarketService';
import trans from '../../../../translation/trans';
import { prettyFormatNumber } from '../../../../utils/prettyFormatNumber';

import s from './ScalarOpinionCard.module.scss';

interface Props {
    market: MarketViewModel
}

export default function ScalarOpinionCard({
    market
}: Props) {
    const bounds = getScalarBounds(market.outcomeTokens.map(t => t.bound));
    const scalarTokens = getScalarLongShortTokens(market.outcomeTokens);
    const scalarValue = FluxSdk.utils.calcScalarValue(bounds.lowerBound, bounds.upperBound, new Big(scalarTokens.longToken.price));

    return (
        <>
            <h2 className={s.title}>
                {trans('market.label.opinion')}
            </h2>
            <div className={s.rangeWrapper}>
                <span>{trans('market.label.scalarRange')}</span>
                <span>{bounds.lowerBound.toString()} - {bounds.upperBound.toString()}</span>
            </div>
            <div className={s.estimateWrapper}>
                <span>{trans('market.label.currentEstimate')}</span>
                <span>
                    {FluxSdk.utils.formatToken(scalarValue.toString(), 0, SCALAR_VALUE_DECIMALS)}
                </span>
            </div>
            <div className={s.volumeWrapper}>
                <span>{trans('market.label.totalVolume')}</span>
                <span>
                    {prettyFormatNumber(formatCollateralToken(market.volume, market.collateralToken.decimals))} {market.collateralToken.tokenSymbol}
                </span>
            </div>
        </>
    );
}
