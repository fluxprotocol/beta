import { calcDistributionHint } from "../utils/calcDistributionHint";
import createProtocolContract from "./contracts/ProtocolContract";

export interface SeedPoolFormValues {
    outcomePercentages: number[];
    mainTokenInput: number;
}

export async function seedPool(marketId: string, values: SeedPoolFormValues) {
    const protocol = await createProtocolContract();
    const weights = calcDistributionHint(values.outcomePercentages);

    protocol.seedPool(
        marketId,
        values.mainTokenInput.toString(),
        weights.map(outcome => outcome.toString())
    );
}
