import FluxSdk from "@fluxprotocol/amm-sdk";
import { MarketViewModel } from "../../../models/Market";
import { SeedScalarMarketFormValues } from "../../../services/PoolService";

export function createDefaultSeedScalarFormValues(market: MarketViewModel): SeedScalarMarketFormValues {
    return {
        initialValue: FluxSdk.utils.calcMedian(market.outcomeTokens.map(token => token.bound)),
        mainTokenInput: '0',
        mainTokenInputFormatted: '0',
    }
}
