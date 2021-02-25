import React, { ReactElement } from 'react';
import { DEFAULT_SLIPPAGE } from '../../../../config';
import { SwapFormValues } from '../../../../services/SwapService';
import trans from '../../../../translation/trans';
import Overview from "./../../../../components/Overview";
import mutateFormValues from './utils/overviewMutation';
import Big from 'big.js';

interface SwapOverviewProps {
    formValues: SwapFormValues
}

export default function SwapOverview({formValues}: SwapOverviewProps): ReactElement {
    let formattedFormValues = mutateFormValues(formValues);
    
    const collateralToken = formValues.fromToken.isCollateralToken ? formValues.fromToken : formValues.toToken;
    const amountIn = new Big(formValues.amountIn);
    const amountOut = new Big(formValues.amountOut);
    const divisor = new Big("100");
    const profitPercentage = formValues.amountIn !== "0" ? amountOut.minus(amountIn).div(amountIn).mul(divisor).round(2).toString() : "0";
    const overViewData = [
        {
            key: trans('market.overview.rate'),
            value: `${formattedFormValues.rateInOut} ${formValues.fromToken.tokenSymbol} / ${formValues.toToken.tokenSymbol}`
        },
        {
            key: trans('market.overview.inverseRate'),
            value: `${formattedFormValues.rateOutIn} ${formValues.toToken.tokenSymbol} / ${formValues.fromToken.tokenSymbol}`
        },
        {
            key: trans('market.overview.estimatedFee'),
            value: `${formattedFormValues.feePaid} ${collateralToken.tokenSymbol}`
        },
        {
            key: trans('market.overview.maxSlippage'),
            value: `${DEFAULT_SLIPPAGE}%`
        },
    ]

    if (formValues.type === "BUY") {
        overViewData.push({
            key: trans('market.overview.maxPayout'),
            value: `${formValues.formattedAmountOut || "0"} ${formValues.fromToken.tokenSymbol} (+${profitPercentage}%)`
        })
    }

    return <Overview data={overViewData} />;
}
