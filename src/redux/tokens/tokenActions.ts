import { isFetchResultSuccesful } from "../../models/FetchResult";
import { getMainToken } from "../../services/MainTokenService";
import { getMarketOutcomeTokens } from "../../services/TokenService";
import { setMainToken, setMarketOutcomeTokens, setTokensError, setTokensLoading } from "./tokens";

export function loadTokens(marketId: string) {
    return async (dispatch: Function) => {
        try {
            dispatch(setTokensLoading(true));

            const mainTokenResponse = await getMainToken();

            if (!isFetchResultSuccesful(mainTokenResponse)) {
                dispatch(setTokensError([mainTokenResponse.error]));
                dispatch(setTokensLoading(false));
                return;
            }

            const outcomeTokens = await getMarketOutcomeTokens(marketId);

            if (!isFetchResultSuccesful(outcomeTokens)) {
                dispatch(setTokensError([outcomeTokens.error]));
                dispatch(setTokensLoading(false));
                return;
            }

            dispatch(setMainToken(mainTokenResponse.data));
            dispatch(setMarketOutcomeTokens(outcomeTokens.data));
            dispatch(setTokensLoading(false));
        } catch (error) {
            dispatch(setTokensLoading(false));
            console.error('[loadMainToken]', error);
        }
    }
}
