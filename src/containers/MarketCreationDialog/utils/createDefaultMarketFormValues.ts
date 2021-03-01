import Big from "big.js";
import { addDays } from "date-fns";
import { FUNGIBLE_TOKEN_ACCOUNT_ID } from "../../../config";
import { MarketType } from "../../../models/Market";
import { MarketFormValues } from "../../../services/MarketService";

export default function createDefaultMarketFormValues(): MarketFormValues {
    return {
        type: MarketType.Binary,
        resolutionDate: addDays(new Date(), 1),
        categories: [],
        isCategoricalMarket: false,
        outcomes: [''],
        description: '',
        extraInfo: '',
        collateralTokenId: FUNGIBLE_TOKEN_ACCOUNT_ID,
        lowerBound: new Big(0),
        upperBound: new Big(1),
    }
}
