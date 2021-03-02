import React, { ReactElement } from 'react';
import TokenWeightsBar from '../../components/TokenWeightsBar';
import { MarketViewModel } from '../../models/Market';
import { formatCollateralToken } from '../../services/CollateralTokenService';
import trans from '../../translation/trans';
import { prettyFormatNumber } from '../../utils/prettyFormatNumber';

import s from './MarketOpinionCard.module.scss';

interface Props {
    market: MarketViewModel;
}

export default function MarketOpinionCard({
    market,
}: Props): ReactElement {
    return (
        <div className={s.root}>
            <h2 className={s['title']}>
                {trans('market.label.opinion')}
            </h2>
            <TokenWeightsBar tokens={market.outcomeTokens} className={s['token-weight-bar']} />
            <div className={s['outcomes-wrapper']}>
                {market.outcomeTokens.map((outcome, index) => (
                    <div key={outcome.outcomeId} className={s['outcome']}>
                        <div className={s['outcome-label-wrapper']}>
                            <div style={{ backgroundColor: `var(${outcome.colorVar})` }} className={s.colorLabel} />
                            <span className={s.tokenName}>{outcome.tokenName}</span>
                        </div>
                        <span className={s.percentage}>{outcome.odds.mul(100).toNumber().toFixed(2)}%</span>
                    </div>
                ))}
            </div>
            <div className={s['volume-wrapper']}>
                <span>{trans('market.label.totalVolume')}</span>
                <span>
                    {prettyFormatNumber(formatCollateralToken(market.volume, market.collateralToken.decimals))} {market.collateralToken.tokenSymbol}
                </span>
            </div>
        </div>
    );
}
