import Big from "big.js";
import { TokenViewModel } from "../../../models/TokenViewModel";
import trans from "../../../translation/trans";

interface LiquidityProviderErrors {
    liquidityAmountIn: string;
    canAddLiquidity: boolean;
}

export interface LiquidityProviderFormValues {
    liquidityAmountIn: string;
    liquidityAmountInFormatted: string;
}

export function validateLiquidityProviderFormValues(formValues: LiquidityProviderFormValues, collateralToken: TokenViewModel): LiquidityProviderErrors {
    const errors: LiquidityProviderErrors = {
        canAddLiquidity: true,
        liquidityAmountIn: '',
    };

    if (formValues.liquidityAmountIn) {
        const inputAmount = formValues.liquidityAmountIn;

        if (new Big(inputAmount).lte(0)) {
            errors.canAddLiquidity = false;
        }

        if (new Big(inputAmount).gt(collateralToken.balance)) {
            errors.liquidityAmountIn = trans('liquidityProvider.errors.notEnoughBalance');
            errors.canAddLiquidity = false;
        }
    } else {
        errors.canAddLiquidity = false;
    }

    return errors;
}
