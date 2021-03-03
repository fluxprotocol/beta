import Big from "big.js";
import { MarketViewModel } from "../../../models/Market";
import { isTradePossible, SwapType } from "../../../services/PriceService";
import { SwapFormValues } from "../../../services/SwapService";
import trans from "../../../translation/trans";

interface SwapFormErrors {
    canSubmit: boolean;
    message: string;
}

export function validateSwapFormValues(formValues: SwapFormValues, market: MarketViewModel): SwapFormErrors {
    const errors: SwapFormErrors = {
        canSubmit: true,
        message: '',
    }

    if (formValues.amountIn) {
        if (new Big(formValues.amountIn).gt(formValues.fromToken.balance)) {
            errors.message = trans('swap.errors.notEnoughBalance');
            errors.canSubmit = false;
        }

        if (new Big(formValues.amountIn).lte(0)) {
            errors.canSubmit = false;
        }

    } else {
        errors.canSubmit = false;
    }

    if (formValues.amountOut) {
        if (new Big(formValues.amountOut).lte(0)) {
            errors.canSubmit = false;
        }
    }

    if (formValues.amountIn && formValues.amountOut) {
        const swapType = formValues.type as SwapType;
        const enoughLiquidity = isTradePossible({
            amountIn: new Big(formValues.amountIn),
            amountOut: new Big(formValues.amountOut),
            market,
            outcomeToken: swapType === SwapType.Buy ? formValues.toToken : formValues.fromToken,
            type: swapType,
        });

        if (!enoughLiquidity) {
            errors.canSubmit = false;
            errors.message = trans('swap.errors.notEnoughLiquidity');
        }
    }

    return errors;
}
