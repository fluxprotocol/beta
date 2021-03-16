import React from 'react';

import classnames from 'classnames';

import trans from '../../translation/trans';
import { Link } from 'react-router-dom';
import { formatCollateralToken } from '../../services/CollateralTokenService';
import { routePaths } from '../../routes';
import s from './EscrowStatusOverview.module.scss';
import { EscrowStatus } from '../../models/EscrowStatus';


interface Props {
    escrowStatus: EscrowStatus[];
    className?: string;
}

export default function EscrowStatusOverview({
    escrowStatus,
    className = '',
}: Props) {
    return (
        <section className={classnames(s.root, className)}>
            <header className={s.header}>
                {trans('escrowStatus.title')}
            </header>
            <div className={s.tableWrapper}>
                <table className={s.table}>
                    <thead className={s.tableHead}>
                        <tr className={s.tableHeadRow}>
                            <th>{trans('escrowStatus.table.market')}</th>
                            <th>{trans('escrowStatus.table.amount')}</th>
                            <th>{trans('escrowStatus.table.payoutState')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/** Filters out any pool tokens */}
                        {escrowStatus.map((info) => {
                            const href = {
                                pathname: routePaths.marketDetail(info.marketId),
                                state: {
                                    canGoBack: true,
                                }
                            };

                            return (
                                <tr className={s.tableRow} key={`${info.marketId}_${info.type}`}>
                                    <td className={s.marketDescriptionCell}>
                                        <Link to={href} className={classnames(s.link, s.marketDescription)}>
                                            {info.marketDescription}
                                        </Link>
                                    </td>
                                    <td >
                                        <Link to={href} className={s.link}>
                                            {formatCollateralToken(info.totalAmount, info.collateralToken.decimals)} {info.collateralToken.symbol}
                                        </Link>
                                    </td>
                                    <td>
                                        <Link to={href} className={s.link}>
                                            {info.type === "invalid_escrow" ? trans('escrowStatus.table.invalid') : trans('escrowStatus.table.valid')}
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
