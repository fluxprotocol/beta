import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

import { PoolToken } from '../../models/PoolToken';
import { routePaths } from '../../routes';
import trans from '../../translation/trans';
import { formatCollateralToken } from '../../services/CollateralTokenService';

import s from './FeesEarnedOverview.module.scss';

interface Props {
    poolTokens: PoolToken[];
    className?: string;
}

export default function FeesEarnedOverview({
    poolTokens,
    className,
}: Props): ReactElement {
    return (
        <section className={classnames(s.root, className)}>
            <header className={s.header}>
                {trans('feesEarned.title')}
            </header>
            <table className={s.table}>
                <thead className={s.tableHead}>
                    <tr className={s.tableHeadRow}>
                        <th>{trans('feesEarned.table.market')}</th>
                        <th>{trans('feesEarned.table.balance')}</th>
                        <th>{trans('feesEarned.table.feesEarned')}</th>
                    </tr>
                </thead>
                <tbody>
                    {poolTokens.map((poolToken) => (
                        <tr className={s.tableRow}>
                            <td>
                                <Link to={routePaths.marketDetail(poolToken.marketId)} className={s.link}>
                                    {poolToken.marketDescription}
                                </Link>
                            </td>
                            <td>
                                <Link to={routePaths.marketDetail(poolToken.marketId)} className={s.link}>
                                    {formatCollateralToken(poolToken.balance)}
                                </Link>
                            </td>
                            <td>
                                <Link to={routePaths.marketDetail(poolToken.marketId)} className={s.link}>
                                    {formatCollateralToken(poolToken.fees)}
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}
