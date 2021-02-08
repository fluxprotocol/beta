import { DEFAULT_FEE } from "../../../config";
import { TokenViewModel } from "../../../models/TokenViewModel";
import { formatCollateralToken } from "../../../services/CollateralTokenService";
import { calcBuyAmountInShares } from "../../../utils/calcBuyAmountInShares";
import { SwapFormValues } from "./../../../services/SwapService";
import Big from "big.js";
import { calcSellAmountInCollateral } from "../../../utils/calcSellAmountOut";

export default function mutateFormValues(formValues: SwapFormValues, tokens: TokenViewModel[]): SwapFormValues {

    if (!formValues.formattedAmountIn) {
        return formValues;
    }

    if (new Big(formValues.formattedAmountIn).lt(0)) {
        return {
            ...formValues,
            formattedAmountIn: "0",
            amountIn: "0",
        }
    }

    const poolBalances = tokens.map(token => new Big(token.poolBalance.toString()));
    const buy = !!formValues.fromToken.tokenAccountId;
    const formattedFee = DEFAULT_FEE / 100;

    const amountOut = buy ? calcBuyAmountInShares(
            new Big(formValues.amountIn),
            formValues.toToken.outcomeId,
            poolBalances,
            formattedFee
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

    return {
        ...formValues,
        formattedAmountOut: formatCollateralToken(amountOut.toString()),
        amountOut: amountOut.round(0, 0).toString()
    };
}
