import React, { ReactElement } from 'react';
import classnames from 'classnames';

import { TokenViewModel } from '../../models/TokenViewModel';

import s from './TokenWeightsBar.module.scss';

interface Props {
    tokens: TokenViewModel[];
    className?: string;
}

export default function TokenWeightsBar({
    tokens,
    className = '',
}: Props): ReactElement {
    return (
        <div className={classnames(s['token-weights-bar'], className)}>
            {tokens.map((token, index) => {
                const weight = token.odds.mul(100);

                return (
                    <span
                        key={index}
                        className={s['token-weights-bar__weight']}
                        style={{
                            width: `${weight.toString()}%`,
                            backgroundColor: `var(${token.colorVar})`,
                        }}
                    />
                );
            })}
        </div>
    );
}
