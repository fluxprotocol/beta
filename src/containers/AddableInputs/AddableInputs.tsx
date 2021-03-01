import React, { ReactElement } from 'react';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import Button from '../../components/Button';
import Label from '../../components/Label';
import TextInput from '../../components/TextInput';
import trans from '../../translation/trans';

import s from './AddableInputs.module.scss';

interface Props {
    onChange: (values: string[]) => void;
    values: string[];
}

export default function AddableInputs({
    onChange,
    values,
}: Props): ReactElement {
    function handleAddMoreClick() {
        values.push('');
        onChange(values);
    }

    function handleRemoveClick(index: number) {
        values.splice(index, 1);
        onChange(values);
    }

    function handleInputChange(value: string, index: number) {
        values[index] = value;
        onChange(values);
    }

    return (
        <div>
            <div className={s.inputs}>
                {values.map((input, index) => (
                    <div className={s.input} key={index}>
                        <Label text={trans('marketCreation.label.outcome', { number: (index + 1).toString() })} />
                        <div className={s.actions}>
                            <TextInput value={input} onChange={(value) => handleInputChange(value, index)} />
                            <IconButton aria-label="remove" className={s.removeIcon} onClick={() => handleRemoveClick(index)}>
                                <DeleteIcon />
                            </IconButton>
                        </div>
                    </div>
                ))}
            </div>

            <Button onClick={handleAddMoreClick} className={s.addMoreButton}>{trans('marketCreation.label.addMoreOutcomes')}</Button>
        </div>
    );
}
