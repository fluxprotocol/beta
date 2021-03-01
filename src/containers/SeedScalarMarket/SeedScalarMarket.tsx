import FluxSdk from '@fluxprotocol/amm-sdk';
import React, { useState } from 'react';
import Error from '../../components/Error';
import TextButton from '../../components/TextButton';
import { MarketViewModel } from '../../models/Market';
import trans from '../../translation/trans';
import TokenSelect from '../TokenSelect';

import s from './SeedScalarMarket.module.scss';
import { createDefaultSeedScalarFormValues } from './utils/createDefaultSeedScalarFormValues';
import { validateSeedScalarMarket } from './utils/validateSeedScalarMarket';

interface Props {
    market: MarketViewModel;
}

export default function SeedScalarMarket({
    market,
}: Props) {
    const [formValues, setFormValues] = useState(createDefaultSeedScalarFormValues());
    const mainToken = market.collateralToken;

    function handleBalanceClick() {
        setFormValues({
            ...formValues,
            mainTokenInputFormatted: mainToken.balanceFormatted,
            mainTokenInput: mainToken.balance,
        });
    }

    function handleMainTokenChange(value: string) {
        const settedValue = value || '0';

        setFormValues({
            ...formValues,
            mainTokenInput: FluxSdk.utils.toToken(settedValue, mainToken.decimals),
            mainTokenInputFormatted: settedValue,
        });
    }

    const errors = validateSeedScalarMarket(formValues);

    return (
        <section>
            <form>
                <p>
                    {trans('seedScalarMarket.explanation', {
                        tokenName: market.collateralToken.tokenSymbol,
                    })}
                </p>

                <div className={s.inputWrapper}>
                    <div className={s.tokenTitles}>
                        <TextButton onClick={handleBalanceClick} className={s.balanceButton}>
                            {trans('global.balance', {}, true)}: {mainToken.balanceFormatted}
                        </TextButton>
                    </div>

                    <TokenSelect
                        onTokenSwitch={() => { }}
                        value={formValues.mainTokenInputFormatted}
                        tokens={[mainToken]}
                        selectedToken={mainToken}
                        onValueChange={handleMainTokenChange}
                        placeholder="1000"
                    />
                    <Error error={errors.mainTokenInput} />
                </div>

                <div className={s.inputWrapper}>
                    <h3>{trans('seedScalar.title')}</h3>
                </div>
            </form>
        </section>
    );
}
