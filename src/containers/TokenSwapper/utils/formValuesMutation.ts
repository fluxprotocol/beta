import Big from "big.js";

import { DEFAULT_FEE } from "../../../config";
import { TokenViewModel } from "../../../models/TokenViewModel";
import { formatCollateralToken } from "../../../services/CollateralTokenService";
import { calcBuyAmountInShares } from "../../../utils/calcBuyAmountInShares";
import { SwapFormValues } from "./../../../services/SwapService";
import { calcSellAmountInCollateral } from "../../../utils/calcSellAmountOut";
import { getPricesAfterTrade, SwapType } from "../../../services/PriceService";
import { MarketViewModel } from "../../../models/Market";

export default function mutateFormValues(formValues: SwapFormValues, tokens: TokenViewModel[], market: MarketViewModel): SwapFormValues {
    const swapType = formValues.type as SwapType;
    const outcomeToken = swapType === SwapType.Buy ? formValues.toToken : formValues.fromToken;
    let newPrices = tokens.map(t => t.price);

    if (!formValues.formattedAmountIn) {
        return {
            ...formValues,
            newPrices,
        };
    }

    if (new Big(formValues.formattedAmountIn).lt(0)) {
        return {
            ...formValues,
            newPrices,
            formattedAmountIn: "0",
            amountIn: "0",
        }
    }

    const poolBalances = tokens.map(token => new Big(token.poolBalance.toString()));
    const buy = !!formValues.fromToken.tokenAccountId;
    const collateralToken = buy ? formValues.fromToken : formValues.toToken;

    const formattedFee = DEFAULT_FEE / 100;

    const amountOut = buy ? calcBuyAmountInShares(
            new Big(formValues.amountIn),
            formValues.toToken.outcomeId,
            poolBalances,
            formattedFee,
            collateralToken.decimals,
        ) :
        calcSellAmountInCollateral(
            new Big(formValues.amountIn),
            formValues.fromToken.outcomeId,
            poolBalances,
            formattedFee
        )

    if (!amountOut) {
        return {
            ...formValues,
            formattedAmountOut: "0",
            amountOut: "0"
        }
    }

    // Calculating the new price of the specific outcome token
    try {
        newPrices = getPricesAfterTrade({
            type: swapType,
            market,
            outcomeToken,
            amountIn: new Big(formValues.amountIn),
            amountOut,
        });
    } catch (error) {}

    return {
        ...formValues,
        formattedAmountOut: formatCollateralToken(amountOut.toString(), collateralToken.decimals),
        amountOut: amountOut.round(0, 0).toString(),
        newPrices,
    };
}
