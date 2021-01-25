import React, { ReactElement, useMemo, useRef, useState } from 'react';

import DateTimePicker from '../../components/DateTimePicker';
import Label from '../../components/Label';
import OptionSwitch from '../../components/OptionSwitch';
import Tag from '../../components/Tag';
import TextInput from '../../components/TextInput';
import Dialog from '../../compositions/Dialog';
import { MarketCategory } from '../../models/Market';
import { MarketFormValues } from '../../services/MarketService';
import trans from '../../translation/trans';
import AddableInputs from '../AddableInputs';
import createDefaultMarketFormValues from './utils/createDefaultMarketFormValues';

import s from './MarketCreationDialog.module.scss';

interface Props {
    open: boolean;
    onRequestClose: () => void;
    onSubmit: (values: MarketFormValues) => void;
}

export default function MarketCreationDialog({
    open,
    onRequestClose,
    onSubmit,
}: Props): ReactElement {
    const formRef = useRef<HTMLFormElement>(null);
    const [formValues, setFormValues] = useState(createDefaultMarketFormValues());
    const marketCategories = useMemo(() => Object.values(MarketCategory).filter(category => category !== MarketCategory.Unknown), []);

    function handleFormSubmit() {
        onSubmit(formValues);
    }

    function handleCategoryClick(category: MarketCategory) {
        let activeCategories = formValues.categories;

        if (activeCategories?.includes(category)) {
            activeCategories = activeCategories.filter(cat => cat !== category);
        } else {
            activeCategories?.push(category);
        }

        setFormValues({
            ...formValues,
            categories: activeCategories,
        });
    }

    function handleResolutionDateChange(date: Date | null) {
        if (!date) return;

        setFormValues({
            ...formValues,
            resolutionDate: date,
        });
    }

    function handleMarketTypeChange(checked: boolean) {
        setFormValues({
            ...formValues,
            isCategoricalMarket: checked,
        });
    }

    function handleOutcomesChange(outcomes: string[]) {
        setFormValues({
            ...formValues,
            outcomes,
        });
    }

    function handleDescriptionChange(description: string) {
        setFormValues({
            ...formValues,
            description,
        });
    }

    function handleExtraInfoChange(extraInfo: string) {
        setFormValues({
            ...formValues,
            extraInfo,
        });
    }

    return (
        <Dialog open={open} title="" onRequestClose={onRequestClose} onSubmitClick={handleFormSubmit}>
            <form className={s.filters} ref={formRef}>
                <div className={s.inputsWrapper}>
                    <label className={s.label}>
                        {trans('marketCreation.label.categorySelect')}
                    </label>
                    <div className={s.categories}>
                        {marketCategories.map((category) => (
                            <Tag
                                key={category}
                                category={category}
                                className={s.filter}
                                active={formValues.categories.includes(category)}
                                onClick={() => handleCategoryClick(category)}
                                type="button"
                            />
                        ))}
                    </div>
                </div>
                <div className={s.inputsWrapper}>
                    <label className={s.label}>
                        {trans('marketCreation.label.description')}
                    </label>
                    <TextInput required multiline onChange={handleDescriptionChange} value={formValues.description} />
                </div>
                <div className={s.inputsWrapper}>
                    <label className={s.label}>
                        {trans('marketCreation.label.extraInfo')}
                    </label>
                    <TextInput required multiline onChange={handleExtraInfoChange} value={formValues.extraInfo} />
                </div>
                <div className={s.inputsWrapper}>
                    <label className={s.label}>
                        {trans('marketCreation.label.marketType')}
                    </label>
                    <OptionSwitch
                        labelA={trans('marketCreation.label.binary')}
                        labelB={trans('marketCreation.label.categorical')}
                        onChange={handleMarketTypeChange}
                        value={formValues.isCategoricalMarket}
                    />
                </div>
                {formValues.isCategoricalMarket && (
                    <div className={s.inputsWrapper}>
                        <Label text={trans('marketCreation.label.outcomes')} />
                        <AddableInputs onChange={handleOutcomesChange} values={formValues.outcomes} />
                    </div>
                )}

                <div className={s.inputsWrapper}>
                    <label className={s.label}>
                        {trans('marketCreation.label.resolutionDate')}
                    </label>

                    <DateTimePicker
                        value={formValues.resolutionDate}
                        onChange={handleResolutionDateChange}
                    />
                </div>
            </form>
        </Dialog>
    );
}
