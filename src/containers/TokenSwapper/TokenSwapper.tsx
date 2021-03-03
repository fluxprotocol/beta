import React, { ReactElement, useState } from 'react';
import classnames from 'classnames';

import Button from '../../components/Button';
import IconButton from '../../components/IconButton';
import { TokenViewModel } from '../../models/TokenViewModel';
import trans from '../../translation/trans';
import TokenSelect from '../TokenSelect';
import SwapOverview from './components/SwapOverview/SwapOverview';

import s from './TokenSwapper.module.scss';
import createDefaultSwapFormValues from './utils/createDefaultSwapFormValues';
import { SwapFormValues } from '../../services/SwapService';
import mutateFormValues from './utils/formValuesMutation';
import { MarketType, MarketViewModel } from '../../models/Market';
import { toCollateralToken } from '../../services/CollateralTokenService';
import { BUY, SELL } from '../../config';

import swap from "./../../assets/images/icons/swap.svg";
import { validateSwapFormValues } from './utils/validateSwapFormValues';
import Error from '../../components/Error';
import TextButton from '../../components/TextButton';
import { getScalarLongShortTokens } from '../../services/MarketService';
import { SwapType } from '../../services/PriceService';
import FluxSdk from '@fluxprotocol/amm-sdk';
import Big from 'big.js';

interface TokenSwapperProps {
    inputs: TokenViewModel[];
    outputs: TokenViewModel[];
    onRequestSwitchPairs: () => void;
    onConfirm: (formData: SwapFormValues) => Promise<void>;
    className?: string;
    market: MarketViewModel;
}

export default function TokenSwapper({
    market,
    inputs,
    outputs,
    onConfirm,
    onRequestSwitchPairs,
    className = '',
}: TokenSwapperProps): ReactElement {
    const [formValues, setFormValues] = useState(createDefaultSwapFormValues(inputs[0], outputs[0]));
    const collateralToken = inputs.length === 1 ? inputs[0] : outputs[0];

    function handleSubmit(mutatedValues: SwapFormValues) {
        onConfirm(mutatedValues);
    }

    function handleInputTokenSwitch(token: TokenViewModel) {
        setFormValues({
            ...formValues,
            fromToken: token
        });
    }

    function handleOutputTokenSwitch(token: TokenViewModel) {
        setFormValues({
            ...formValues,
            toToken: token
        });
    }

    function handleAmountInChange(value: string) {
        setFormValues({
            ...formValues,
            formattedAmountIn: value,
            amountIn: value ? toCollateralToken(value, collateralToken.decimals) : "0"
        });
    }

    function handleBalanceClick() {
        setFormValues({
            ...formValues,
            amountIn: formValues.fromToken.balance,
            formattedAmountIn: formValues.fromToken.balanceFormatted,
        });
    }

    // TODO: mutation makes token values after switch go down recursively, should only switch between 2 states
    function switchTokenPlaces() {
        setFormValues({
            ...formValues,
            type: inputs.length === 1 ? SELL : BUY,
            amountIn: formValues.amountOut,
            amountOut: formValues.amountIn,
            formattedAmountIn: formValues.formattedAmountOut,
            formattedAmountOut: formValues.formattedAmountIn,
            fromToken: formValues.toToken,
            toToken: formValues.fromToken,
        });
        onRequestSwitchPairs();
    }

    const poolTokens = outputs.length > 1 ? outputs : inputs;
    const mutation = mutateFormValues(formValues, poolTokens, market);
    const errors = validateSwapFormValues(mutation, market);
    const scalarTokens = getScalarLongShortTokens(market.outcomeTokens);
    const swapType = mutation.type as SwapType;
    const newEstimate = FluxSdk.utils.calcScalarValue(
        scalarTokens.lowerBound,
        scalarTokens.upperBound,
        new Big(mutation.newPrices[scalarTokens.longToken.outcomeId])
    );

    return (
        <form className={classnames(s['token-swapper'], className)}>
            <div className={s['token-swapper__token']}>
                <div className={classnames(s.tokenHeader, s.noMargin)}>
                    <span>{trans('market.label.youPay')}</span>
                    <TextButton onClick={handleBalanceClick} className={s.balanceButton}>
                        {trans('global.balance', {}, true)}: {mutation.fromToken.balanceFormatted}
                    </TextButton>
                </div>
                <TokenSelect
                    onTokenSwitch={handleInputTokenSwitch}
                    value={mutation.formattedAmountIn}
                    tokens={inputs}
                    selectedToken={mutation.fromToken}
                    onValueChange={(v) => handleAmountInChange(v)}
                    newPrice={mutation.fromToken.isCollateralToken ? undefined : mutation.newPrices[mutation.fromToken.outcomeId]}
                />
            </div>

            <div className={s['token-swapper__switch-tokens']}>
                <IconButton onClick={switchTokenPlaces} icon={swap} alt={trans('market.action.switchTokens')} />
            </div>

            <div className={s.receiveInputs}>
                <div className={s.tokenHeader}>
                    <span>{trans('market.label.youReceive')}</span>
                </div>
                <TokenSelect
                    onTokenSwitch={handleOutputTokenSwitch}
                    value={mutation.formattedAmountOut}
                    tokens={outputs}
                    selectedToken={mutation.toToken}
                    disabledInput
                    newPrice={mutation.toToken.isCollateralToken ? undefined : mutation.newPrices[mutation.toToken.outcomeId]}
                />
            </div>

            {market.type === MarketType.Scalar && swapType === SwapType.Buy && (
                <div className={s.newEstimateWrapper}>
                    <span className={s.newEstimateText}>
                        {scalarTokens.longToken.outcomeId === mutation.toToken.outcomeId ?
                            trans('market.overview.estimateMoreAfterTrade') :
                            trans('market.overview.estimateLessAfterTrade')
                        }
                    </span>
                    <span>{newEstimate.toFixed(2)}</span>
                </div>
            )}

            <SwapOverview formValues={mutation} market={market} />
            <Error error={errors.message} />

            <Button disabled={!errors.canSubmit} onClick={() => handleSubmit(mutation)} className={s['token-swapper__confirm']}>
                {trans('market.action.confirmSwap')}
            </Button>
        </form>
    );
}
