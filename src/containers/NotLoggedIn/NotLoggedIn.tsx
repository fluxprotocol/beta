import React, { ReactElement } from 'react';

import Button from '../../components/Button';
import trans from '../../translation/trans';

import s from './NotLoggedIn.module.scss';

interface Props {
    onLoginClick: () => void;
}

export default function NotLoggedIn({
    onLoginClick
}: Props): ReactElement {
    return (
        <div>
            <div>
                <h2>{trans('notLoggedIn.title')}</h2>
                <p>{trans('notLoggedIn.description')}</p>
            </div>
            <Button
                className={s.confirmButton}
                onClick={onLoginClick}
            >
                {trans('notLoggedIn.action.login')}
            </Button>
        </div>
    );
}
