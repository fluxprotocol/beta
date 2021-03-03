import React, { ReactElement } from 'react';
import trans from '../../translation/trans';
import s from './Overview.module.scss';

interface KeyValue {
    key: string,
    value: string
}

interface Props {
    header: string,
    data: KeyValue[]
}

export default function Overview({
    data,
    header
}: Props): ReactElement {
    return (
        <div className={s['overview__container']}>
            <div className={s.header}>
                <span>{ header }</span>
            </div>
            <div className={s['overview']}>
                {
                    data.map((d, i) => (
                        <div key={i} className={s['overview__info-row']}>
                            <span className={s['overview__info-key']}>{d.key}</span>
                            <span className={s['overview__info-value']}>{d.value}</span>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}
