import Big from "big.js";
import { MarketViewModel } from "../../../models/Market";
import { TokenViewModel } from "../../../models/TokenViewModel";
import { toCollateralToken } from "../../../services/CollateralTokenService";
import { SeedPoolFormValues } from "../../../services/PoolService";
import trans from "../../../translation/trans";

export interface SeedPoolFormErrors {
    outcomePercentages: string[];
    canSeed: boolean;
    canPublish: boolean;
    message: string;
    mainTokenInput: string;
}

export function validateSeedPool(formValues: SeedPoolFormValues, market: MarketViewModel) {
    const errors: SeedPoolFormErrors = {
        outcomePercentages: [],
        canSeed: true,
        canPublish: true,
        message: '',
        mainTokenInput: '',
    }

    errors.outcomePercentages = formValues.outcomePercentages.map(percentage => {
        if (percentage <= 0) return trans('seedPool.inputZero');
        if (percentage >= 100) return trans('seedPool.input100');

        return '';
    });

    const hasOutcomeErrors = errors.outcomePercentages.some(item => item !== '');
    const percentageTogether = formValues.outcomePercentages.reduce((prev, cur) => prev + cur, 0);

    if (hasOutcomeErrors || percentageTogether !== 100) {
        errors.canSeed = false;
    }

    if (percentageTogether !== 100) {
        errors.message = trans('seedPool.not100Percent', {
            percentage: percentageTogether.toString(),
        });
    }

    const inputAmount = toCollateralToken(formValues.mainTokenInput.toString());

    if (new Big(inputAmount).lte(0)) {
        errors.canSeed = false;
    }

    if (new Big(inputAmount).gt(market.collateralToken.balance)) {
        errors.mainTokenInput = trans('seedPool.errors.notEnoughBalance');
        errors.canSeed = false;
    }

    if (market.seedNonce === '1') {
        errors.canPublish = false;
    }

    return errors;
}
