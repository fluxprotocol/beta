import Big from "big.js";
import { SwapFormValues } from "../../../services/SwapService";
import trans from "../../../translation/trans";

interface SwapFormErrors {
    canSubmit: boolean;
    message: string;
}

export function validateSwapFormValues(formValues: SwapFormValues): SwapFormErrors {
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

    return errors;
}
