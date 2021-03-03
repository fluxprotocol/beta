import Big from "big.js";
import FluxSdk from "@fluxprotocol/amm-sdk";

import { TokenViewModel } from "../models/TokenViewModel";
import { MarketViewModel } from "../models/Market";
import { DEFAULT_FEE } from "../config";

export enum SwapType {
    Buy = 'BUY',
    Sell = 'SELL',
}

interface GetPricesAfterTradeParams {
    type: SwapType;
    market: MarketViewModel;
    outcomeToken: TokenViewModel;
    amountIn: Big;
    amountOut: Big;
}

export function getPricesAfterTrade({
    type,
    market,
    outcomeToken,
    amountIn,
    amountOut,
}: GetPricesAfterTradeParams): number[] {
    if (type === SwapType.Buy) {
        const newPoolBalances = FluxSdk.utils.computeBalanceAfterSharePurchase(
            market.outcomeTokens.map(t => new Big(t.poolBalance)),
            outcomeToken.outcomeId,
            amountIn,
            amountOut,
            DEFAULT_FEE,
        );

        return FluxSdk.utils.calcPrice(newPoolBalances.map(b => b.toString()));
    }

    const newPoolBalances = FluxSdk.utils.computeBalanceAfterShareSale(
        market.outcomeTokens.map(t => new Big(t.poolBalance)),
        outcomeToken.outcomeId,
        amountOut,
        amountIn,
        DEFAULT_FEE,
    );

    return FluxSdk.utils.calcPrice(newPoolBalances.map(b => b.toString()));
}

export function isTradePossible(params: GetPricesAfterTradeParams): boolean {
    try {
        getPricesAfterTrade(params);

        return true;
    } catch (error) {
        return false;
    }
}
