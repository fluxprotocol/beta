import React from 'react';

import classnames from 'classnames';

import { UserBalance } from '../../models/UserBalance';
import trans from '../../translation/trans';
import { Link } from 'react-router-dom';
import { formatCollateralToken } from '../../services/CollateralTokenService';
import { routePaths } from '../../routes';

import s from './UserBalancesOverview.module.scss';


interface Props {
    balances: UserBalance[];
    className?: string;
}

export default function UserBalancesOverview({
    balances,
    className = '',
}: Props) {
    return (
        <section className={classnames(s.root, className)}>
            <header className={s.header}>
                {trans('userbalances.title')}
            </header>
            <table className={s.table}>
                <thead className={s.tableHead}>
                    <tr className={s.tableHeadRow}>
                        <th>{trans('userbalances.table.market')}</th>
                        <th>{trans('userbalances.table.outcome')}</th>
                        <th>{trans('userbalances.table.balance')}</th>
                        <th>{trans('userbalances.table.status')}</th>
                    </tr>
                </thead>
                <tbody>
                    {/** Filters out any pool tokens */}
                    {balances.filter(balance => balance.outcomeTag).map((info) => (
                        <tr className={s.tableRow} key={`${info.marketId}_${info.outcomeId}`}>
                            <td>
                                <Link to={routePaths.marketDetail(info.marketId)} className={s.link}>
                                    {info.marketDescription}
                                </Link>
                            </td>
                            <td>
                                <Link to={routePaths.marketDetail(info.marketId)} className={s.link}>
                                    {info.outcomeTag}
                                </Link>
                            </td>
                            <td>
                                <Link to={routePaths.marketDetail(info.marketId)} className={s.link}>
                                    {formatCollateralToken(info.balance)}
                                </Link>
                            </td>
                            <td>
                                <Link to={routePaths.marketDetail(info.marketId)} className={s.link}>
                                    {info.marketStatus}
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}
