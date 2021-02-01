import { SeedPoolFormValues } from "../../../services/PoolService";

export default function createDefaultSeedPoolFormValues(): SeedPoolFormValues {
    return {
        outcomePercentages: [],
        mainTokenInput: 1,
    };
}
