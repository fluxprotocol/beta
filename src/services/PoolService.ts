import Big from "big.js";
import { calcDistributionHint } from "../utils/calcDistributionHint";
import createProtocolContract from "./contracts/ProtocolContract";
import createTokenContract from "./contracts/TokenContract";

export interface SeedPoolFormValues {
    outcomePercentages: string[];
    mainTokenInput: string;
    mainTokenInputFormatted: string;
}

export interface SeedScalarMarketFormValues {
    initialValue: Big;
    mainTokenInput: string;
    mainTokenInputFormatted: string;
}

export async function seedPool(marketId: string, tokenId: string, values: SeedPoolFormValues) {
    const token = await createTokenContract(tokenId);
    const weights = calcDistributionHint(values.outcomePercentages.map(p => Number(p)));

    token.addLiquidity(
        marketId,
        values.mainTokenInput,
        weights.map(outcome => outcome.toString())
    );
}

export async function joinPool(marketId: string, amountIn: string, tokenId: string) {
    const token = await createTokenContract(tokenId);
    token.addLiquidity(marketId, amountIn);
}

export async function exitPool(marketId: string, amountIn: string) {
    const token = await createProtocolContract();

    token.exitPool(marketId, amountIn);
}
