import Big from "big.js";
import { SeedScalarMarketFormValues } from "../../../services/PoolService";

export function createDefaultSeedScalarFormValues(): SeedScalarMarketFormValues {
    return {
        initialValue: new Big(0),
        mainTokenInput: '0',
        mainTokenInputFormatted: '0',
    }
}
