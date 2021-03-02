import React from 'react';
import Token from '../../../../components/Token';
import { TokenViewModel } from '../../../../models/TokenViewModel';
import trans from '../../../../translation/trans';

import s from './TokenDropdown.module.scss';

interface Props {
    tokens: TokenViewModel[];
    onTokenClick: (token: TokenViewModel) => void;
}

export default function TokenDropdown({
    tokens,
    onTokenClick,
}: Props) {
    return (
        <div className={s['token-dropdown']}>
            <div className={s['token-dropdown__fake-top']} />
            <div className={s['token-dropdown__content']}>
                <div className={s['token-dropdown__balance']}>
                    {trans('global.balance')}
                </div>
                <div className={s['token-dropdown__tokens']}>
                    {tokens.map((token) => (
                        <button key={token.tokenName} onClick={() => onTokenClick(token)} className={s['token-dropdown__token']}>
                            <div className={s['token-dropdown__token-info']}>
                                <Token colorVar={token.colorVar} tokenName={token.tokenName} className={s['token-dropdown__token-icon']} />
                                <span>{token.tokenName}</span>
                            </div>
                            <div className={s['token-dropdown__token-balance']}>
                                {token.balanceFormatted}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
