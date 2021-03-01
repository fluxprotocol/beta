import { SeedScalarMarketFormValues } from "../../../services/PoolService";

export interface SeedScalarMarketFormErrors {
    canSubmit: boolean;
    message: string;
    mainTokenInput: string;
}

export function validateSeedScalarMarket(formValues: SeedScalarMarketFormValues): SeedScalarMarketFormErrors {
    const errors: SeedScalarMarketFormErrors = {
        canSubmit: true,
        message: '',
        mainTokenInput: '',
    };

    return errors;
}
