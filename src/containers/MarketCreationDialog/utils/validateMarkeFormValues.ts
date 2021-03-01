import { MarketType } from "../../../models/Market";
import { MarketFormValues } from "../../../services/MarketService";
import trans from "../../../translation/trans";

export interface MarketFormErrors {
    canSubmit: boolean;
    upperBound: string;
}

export function validateMarketFormValues(formValues: MarketFormValues): MarketFormErrors {
    const errors: MarketFormErrors = {
        canSubmit: true,
        upperBound: '',
    };

    if (formValues.type === MarketType.Scalar) {
        if (formValues.upperBound.lte(formValues.lowerBound)) {
            errors.canSubmit = false;
            errors.upperBound = trans('marketCreation.errors.upperBoundLessThanLowerBound');
        }
    }

    return errors;
}
