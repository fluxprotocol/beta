import React, { useState } from 'react';
import Button from '../../components/Button';
import Error from '../../components/Error';
import TextButton from '../../components/TextButton';
import { MarketViewModel } from '../../models/Market';
import { PoolToken, transformPoolTokenToTokenViewModel } from '../../models/PoolToken';
import { formatCollateralToken, toCollateralToken } from '../../services/CollateralTokenService';
import trans from '../../translation/trans';
import TokenSelect from '../TokenSelect';

import s from './ExitPool.module.scss';
import createDefaultExitPoolFormValues, { ExitPoolFormValues } from './services/createDefaultExitPoolFormValues';
import validateExitPool from './services/validateExitPool';

interface Props {
    market: MarketViewModel;
    poolToken: PoolToken;
    onExitPool: (formValues: ExitPoolFormValues) => void;
}

export default function ExitPool({
    market,
    poolToken,
    onExitPool,
}: Props) {
    const [formValues, setFormValues] = useState(createDefaultExitPoolFormValues());
    const token = transformPoolTokenToTokenViewModel(poolToken);

    function handleAmountInChange(value: string) {
        setFormValues({
            ...formValues,
            amountIn: value ? toCollateralToken(value) : '',
            amountInFormatted: value,
        });
    }

    function handleSubmit() {
        onExitPool(formValues);
    }

    function handleBalanceClick() {
        setFormValues({
            ...formValues,
            amountIn: poolToken.balance,
            amountInFormatted: poolToken.balanceFormatted,
        });
    }

    const errors = validateExitPool(formValues, poolToken);

    return (
        <section>
            <p>
                {trans('exitPool.description')}
            </p>
            <div className={s.header}>
                <span>{trans('exitPool.label.youInsert')}</span>
                <TextButton onClick={handleBalanceClick} className={s.balanceButton}>
                    {trans('global.balance', {}, true)}: {poolToken.balanceFormatted}
                </TextButton>
            </div>
            <TokenSelect
                value={formValues.amountInFormatted}
                onValueChange={handleAmountInChange}
                onTokenSwitch={() => { }}
                selectedToken={token}
                tokens={[token]}
                className={s.tokenSelect}
                showPrice={false}
            />
            <Error error={errors.amountIn} />
            <p>
                {trans('exitPool.label.feesEarned', {
                    amount: formatCollateralToken(poolToken.fees, market.collateralToken.decimals, 8),
                })}
            </p>
            <Button onClick={handleSubmit} className={s.confirm} disabled={!errors.canSubmit}>
                {trans('exitPool.action.exitPool')}
            </Button>
        </section>
    );
}
