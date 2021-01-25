import { addDays } from "date-fns";
import { MarketFormValues } from "../../../services/MarketService";

export default function createDefaultMarketFormValues(): MarketFormValues {
    return {
        resolutionDate: addDays(new Date(), 1),
        categories: [],
        isCategoricalMarket: false,
        outcomes: [''],
        description: '',
        extraInfo: '',
    }
}
