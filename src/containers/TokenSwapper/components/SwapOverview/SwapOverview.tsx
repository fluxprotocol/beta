import React, { ReactElement } from 'react';
import { DEFAULT_SLIPPAGE } from '../../../../config';
import { SwapFormValues } from '../../../../services/SwapService';
import trans from '../../../../translation/trans';
import Overview from "./../../../../components/Overview";
import mutateFormValues from './utils/overviewMutation';
import Big from 'big.js';
import { formatCollateralToken } from '../../../../services/CollateralTokenService';
import { MarketType, MarketViewModel } from '../../../../models/Market';
import { getPricesAfterTrade, SwapType } from '../../../../services/PriceService';
import FluxSdk from '@fluxprotocol/amm-sdk';
import { getScalarLongShortTokens } from '../../../../services/MarketService';

interface SwapOverviewProps {
    formValues: SwapFormValues,
    market: MarketViewModel;
}

export default function SwapOverview({
    formValues,
    market,
}: SwapOverviewProps): ReactElement {
    const formattedFormValues = mutateFormValues(formValues);

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

    if (formValues.type === SwapType.Buy) {
        overViewData.push({
            key: trans('market.overview.maxPayout'),
            value: `${formValues.formattedAmountOut || "0"} ${formValues.fromToken.tokenSymbol} (+${profitPercentage}%)`
        });
    } else if (amountIn.gt("0")) {
        const spent = new Big(formValues.fromToken.spent);
        const balance = new Big(formValues.fromToken.balance);
        const avgPaidPrice = balance.gt("0") ? spent.div(balance) : new Big("0");
        const avgSellPrice = amountIn.gt("0") ? amountOut.div(amountIn) : new Big("0");
        const spendAtAvgSellPrice = avgSellPrice.mul(amountIn);
        const spendAtAvgPaidPrice = avgPaidPrice.mul(amountIn);

        if (avgPaidPrice.gt(avgSellPrice)) {
            // Escrow invalid
            const escrowInvalid = spendAtAvgPaidPrice.minus(spendAtAvgSellPrice);
            const formattedEscrowInvalid = escrowInvalid.gt("0.01") ? formatCollateralToken(escrowInvalid.toString(), formValues.toToken.decimals) : "< 0.01";
            overViewData.push(
                {
                    key: trans('market.overview.escrowInvalid'),
                    value: `~${formattedEscrowInvalid}${formValues.toToken.tokenSymbol}`
                },
                {
                    key: trans('market.overview.paidNow'),
                    value: `${formValues.formattedAmountOut} ${formValues.toToken.tokenSymbol}`
                }
            );

        } else if ((avgSellPrice.gt(avgPaidPrice))){
            // Escrow valid
            const escrowInvalid = spendAtAvgSellPrice.minus(spendAtAvgPaidPrice);
            const formattedEscrowInvalid = escrowInvalid.gt("0.01") ? formatCollateralToken(escrowInvalid.toString(), formValues.toToken.decimals) : "< 0.01";
            const paidNow = amountOut.minus(escrowInvalid);
            const formattedOutNow = formatCollateralToken(paidNow.toString(), formValues.toToken.decimals);

            overViewData.push(...[
                {
                    key: trans('market.overview.escrowValid'),
                    value: `~${formattedEscrowInvalid} ${formValues.toToken.tokenSymbol}`
                },
                {
                    key: trans('market.overview.paidNow'),
                    value: `${formattedOutNow} ${formValues.toToken.tokenSymbol}`
                }
            ]);
        }
    }

    return <Overview data={overViewData} header={trans('market.label.overview', {}, true)} />;
}
