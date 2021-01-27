import { getPricesHistoryByMarketId, Period } from "../../services/PricesHistoryService";
import { setPriceHistoryLoading, setPricesHistory } from "./priceHistory";

export function fetchPricesHistoryByMarketId(marketId: string, period: Period = Period.All) {
    return async (dispatch: Function) => {
        try {
            dispatch(setPriceHistoryLoading(true));

            const pricesHistory = await getPricesHistoryByMarketId(marketId, period);
            dispatch(setPricesHistory(pricesHistory));

            dispatch(setPriceHistoryLoading(false));
        } catch (error) {
            dispatch(setPriceHistoryLoading(false));
            console.error('[getPricesHistoryByMarketId]', error);
        }
    };
}
