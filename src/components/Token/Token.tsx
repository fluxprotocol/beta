import React, { ReactElement } from 'react';
import classnames from 'classnames';

import { generateTokenName } from '../../models/TokenViewModel';

import s from './Token.module.scss';

interface Props {
    className?: string;
    tokenName: string;
}

export default function Token({
    tokenName,
    className = '',
}: Props): ReactElement {
    return (
        <div className={classnames(s.token, className)}>
            {generateTokenName(tokenName)}
        </div>
    );
}
