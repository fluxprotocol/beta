import React, { ReactElement, useState } from 'react';

import Button from '../../components/Button';
import { TokenViewModel } from '../../models/TokenViewModel';
import trans from '../../translation/trans';
import TokenSelect from '../TokenSelect';
import { LiquidityProviderFormValues, validateLiquidityProviderFormValues } from './services/validateLiquidityProviderFormValues';

import s from './LiquidityProvider.module.scss';
import Error from '../../components/Error';
import TextButton from '../../components/TextButton';
import { toCollateralToken } from '../../services/CollateralTokenService';

interface Props {
    token: TokenViewModel;
    onSubmit: (formValues: LiquidityProviderFormValues) => void;
}

export default function LiquidityProvider({
    token,
    onSubmit,
}: Props): ReactElement {
    const [formValues, setFormValues] = useState<LiquidityProviderFormValues>({
        liquidityAmountIn: '',
        liquidityAmountInFormatted: '',
    });

    function handleSubmit() {
        onSubmit(formValues);
    }

    function handleInChange(value: string) {
        setFormValues({
            ...formValues,
            liquidityAmountIn: value ? toCollateralToken(value) : '',
            liquidityAmountInFormatted: value,
        });
    }

    function handleBalanceClick() {
        setFormValues({
            ...formValues,
            liquidityAmountIn: token.balance,
            liquidityAmountInFormatted: token.balanceFormatted,
        });
    }

    const errors = validateLiquidityProviderFormValues(formValues, token);

    return (
        <div>
            <p>
                {trans('liquidityProvider.description', {
                    percentage: '2',
                })}
            </p>

            <div className={s.header}>
                <span>{trans('market.label.youPay')}</span>
                <TextButton onClick={handleBalanceClick} className={s.balanceButton}>
                    {trans('global.balance', {}, true)}: {token.balanceFormatted}
                </TextButton>
            </div>

            <TokenSelect
                value={formValues.liquidityAmountInFormatted}
                onValueChange={(v) => handleInChange(v)}
                onTokenSwitch={() => {}}
                selectedToken={token}
                tokens={[token]}
                className={s.tokenSelect}
                placeholder="1000"
            />

            <Error error={errors.liquidityAmountIn} />

            <Button disabled={!errors.canAddLiquidity} onClick={handleSubmit} className={s.confirm}>
                {trans('market.action.confirmLiquidity')}
            </Button>
        </div>
    );
}
