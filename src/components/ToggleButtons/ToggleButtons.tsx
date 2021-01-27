import React, { ReactElement } from 'react';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import {default as MuiToggleButton} from '@material-ui/lab/ToggleButton';

import s from './ToggleButtons.module.scss';

interface Props {
    items: {
        text: string,
        id: string,
    }[],
    value: string;
    exclusive?: boolean;
    onChange: (value: any) => void;
}

export default function ToggleButtons({
    items,
    value,
    onChange,
    exclusive,
}: Props): ReactElement {
    return (
        <ToggleButtonGroup exclusive={exclusive} value={value} onChange={(_, v) => onChange(v)}>
            {items.map((item) => (
                <MuiToggleButton key={item.id} className={s.button} classes={{ selected: s.selected }} value={item.id}>
                    {item.text}
                </MuiToggleButton>
            ))}
        </ToggleButtonGroup>
    );
}
