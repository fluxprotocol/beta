import React, { ReactElement, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import FeesEarnedOverviewConnector from '../../connectors/FeesEarnedOverviewConnector';
import UserBalancesOverviewConnector from '../../connectors/UserBalancesOverviewConnector';
import Page from '../../containers/Page';
import { loadAccountBalanceInfo } from '../../redux/account/accountActions';
import { Reducers } from '../../redux/reducers';

import s from './ProfilePage.module.scss';


export default function ProfilePage(): ReactElement {
    const dispatch = useDispatch();
    const account = useSelector((store: Reducers) => store.account.account);

    useEffect(() => {
        if (!account) return;
        dispatch(loadAccountBalanceInfo(account.accountId));
    }, [dispatch, account]);

    return (
        <Page hasFooter={false} className={s.root} bodyClassName={s.pageBody} size="large">
            <UserBalancesOverviewConnector className={s.userBalances} />
            <FeesEarnedOverviewConnector className={s.feesEarned} />
        </Page>
    );
}
