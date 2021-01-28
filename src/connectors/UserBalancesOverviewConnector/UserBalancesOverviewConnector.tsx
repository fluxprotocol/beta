import React from 'react';
import { useSelector } from 'react-redux';
import UserBalancesOverview from '../../containers/UserBalancesOverview';
import { Reducers } from '../../redux/reducers';

interface Props {
    className?: string;
}

export default function UserBalancesOverviewConnector({
    className,
}: Props) {
    const balances = useSelector((store: Reducers) => store.account.balances);

    return (
        <UserBalancesOverview balances={balances} className={className} />
    );
}
