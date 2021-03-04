import React, { ReactElement } from 'react';
import Button from '../../components/Button';
import { Account } from '../../models/Account';
import trans from '../../translation/trans';

import s from './HomeHeader.module.scss';

interface Props {
    onCreateMarketClick: () => void;
    account: Account | null;
}

export default function HomeHeader({
    onCreateMarketClick,
    account,
}: Props): ReactElement {
    return (
        <div className={s.root}>
            <div className={s.titleWrapper}>
                <h1 className={s.title}>
                    {trans('home.title.welcome', {
                        username: account?.accountId || '',
                    })}
                </h1>
                <span className={s.subTitle}>{trans('home.title.latestTrends')}</span>
            </div>

            {process.env.REACT_APP_NETWORK !== "mainnet" && <Button onClick={onCreateMarketClick}>{trans('global.actions.createMarket')}</Button>}
        </div>
    );
}
