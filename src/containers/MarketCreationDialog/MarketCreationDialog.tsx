import React, { ReactElement, useMemo, useRef, useState } from 'react';

import DateTimePicker from '../../components/DateTimePicker';
import Label from '../../components/Label';
import Tag from '../../components/Tag';
import TextInput from '../../components/TextInput';
import Dialog from '../../compositions/Dialog';
import { MarketCategory, MarketType } from '../../models/Market';
import { MarketFormValues } from '../../services/MarketService';
import trans from '../../translation/trans';
import AddableInputs from '../AddableInputs';
import createDefaultMarketFormValues from './utils/createDefaultMarketFormValues';

import s from './MarketCreationDialog.module.scss';
import Select from '../../components/Select';
import { SelectItem } from '../../components/Select/Select';
import { TokenMetadata } from '../../models/TokenMetadata';
import ToggleButtons from '../../components/ToggleButtons';
import Big from 'big.js';
import { validateMarketFormValues } from './utils/validateMarkeFormValues';

interface Props {
    open: boolean;
    tokenWhitelist: TokenMetadata[];
    onRequestClose: () => void;
    onSubmit: (values: MarketFormValues) => void;
}

export default function MarketCreationDialog({
    open,
    tokenWhitelist,
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

    function handleCollateralChange(item: SelectItem) {
        setFormValues({
            ...formValues,
            collateralTokenId: item.value,
        });
    }

    function handleMarketTypeChange(type: MarketType | null) {
        if (type === null) return;
        setFormValues({
            ...formValues,
            type,
        });
    }

    function handleLowerBoundChange(value: string) {
        if (!value) return;

        setFormValues({
            ...formValues,
            lowerBound: new Big(value),
        });
    }

    function handleUpperBoundChange(value: string) {
        if (!value) return;

        setFormValues({
            ...formValues,
            upperBound: new Big(value),
        });
    }

    const errors = validateMarketFormValues(formValues);

    return (
        <Dialog open={open} title="" canSubmit={errors.canSubmit} onRequestClose={onRequestClose} onSubmitClick={handleFormSubmit}>
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
                        {trans('marketCreation.label.collateralToken')}
                    </label>
                    <Select
                        onChange={handleCollateralChange}
                        value={formValues.collateralTokenId}
                        items={tokenWhitelist.map((metadata) => ({
                            label: metadata.symbol,
                            value: metadata.collateralTokenId,
                        }))}
                    />
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
                    <ToggleButtons
                        exclusive
                        buttonClassName={s.marketType}
                        selectedClassName={s['marketType--selected']}
                        value={formValues.type}
                        onChange={handleMarketTypeChange}
                        items={[
                            {
                                id: MarketType.Binary,
                                text: trans('marketCreation.label.binary'),
                            },
                            {
                                id: MarketType.Categorical,
                                text: trans('marketCreation.label.categorical'),
                            },
                            {
                                id: MarketType.Scalar,
                                text: trans('marketCreation.label.scalar'),
                            }
                        ]}
                    />
                </div>

                {formValues.type === MarketType.Categorical && (
                    <div className={s.inputsWrapper}>
                        <Label text={trans('marketCreation.label.outcomes')} />
                        <AddableInputs onChange={handleOutcomesChange} values={formValues.outcomes} />
                    </div>
                )}

                {formValues.type === MarketType.Scalar && (
                    <>
                        <div className={s.inputsWrapper}>
                            <Label text={trans('marketCreation.label.scalarLowerBound')} />
                            <TextInput type="number" value={formValues.lowerBound.toString()} onChange={handleLowerBoundChange} />
                        </div>
                        <div className={s.inputsWrapper}>
                            <Label text={trans('marketCreation.label.scalarUpperBound')} />
                            <TextInput type="number" value={formValues.upperBound.toString()} onChange={handleUpperBoundChange} helperText={errors.upperBound} error={!!errors.upperBound} />
                        </div>
                    </>
                )}

                <div className={s.inputsWrapper}>
                    <label className={s.label}>
                        {trans('marketCreation.label.resolutionDate')}
                    </label>

                    <DateTimePicker
                        value={formValues.resolutionDate}
                        onChange={handleResolutionDateChange}
                        helperText={trans('marketCreation.label.helperText.resolutionDate')}
                    />
                </div>
            </form>
        </Dialog>
    );
}
