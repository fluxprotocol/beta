import React, { ReactElement } from 'react';
import classnames from 'classnames';

import { MarketViewModel } from '../../models/Market';
import trans from '../../translation/trans';
import getCategoryInfo from '../../utils/getCategoryInfo';
import { formatResolutionDate } from '../../services/MarketService';

import s from './MarketInfoCard.module.scss';

interface Props {
    market: MarketViewModel;
    className?: string;
}

export default function MarketInfoCard({
    market,
    className = '',
}: Props): ReactElement {
    const categoryInfo = market.category.length ? market.category.map(category => getCategoryInfo(category)) : [getCategoryInfo()];

    console.log('[] categoryInfo[0].cardIcon -> ', categoryInfo[0].cardIcon);

    return (
        <div className={classnames(s.root, className)} style={{ backgroundColor: categoryInfo[0].color }}>
            <div>
                <span className={s.categoryTitle}>{categoryInfo.map(info => info.title).join(' | ')}</span>
                <h2 className={s.title}>{market.description}</h2>
            </div>
            <img className={s.bubble} src={categoryInfo[0].cardIcon} alt={market.category[0]} />
            <div className={s.resolutionInfo}>
                <span>{trans('market.resolutionDate')} <strong>{formatResolutionDate(market.resolutionDate)}</strong></span>
            </div>
        </div>
    );
}
