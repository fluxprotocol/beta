import React, { ReactElement } from 'react';
import classnames from 'classnames';
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
    className?: string;
    buttonClassName?: string;
    selectedClassName?: string;
    onChange: (value: any) => void;
}

export default function ToggleButtons({
    items,
    value,
    onChange,
    exclusive,
    selectedClassName = '',
    buttonClassName = '',
    className = '',
}: Props): ReactElement {
    return (
        <ToggleButtonGroup className={className} exclusive={exclusive} value={value} onChange={(_, v) => onChange(v)}>
            {items.map((item) => (
                <MuiToggleButton
                    key={item.id}
                    className={classnames(s.button, buttonClassName)}
                    classes={{
                        selected: selectedClassName || s.selected,
                    }}
                    value={item.id}
                >
                    {item.text}
                </MuiToggleButton>
            ))}
        </ToggleButtonGroup>
    );
}
