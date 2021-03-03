import { MarketViewModel } from "../../models/Market";
import { TokenViewModel } from "../../models/TokenViewModel";
import { getPoolBalanceForMarketByAccount } from "../../services/AccountService";
import { getCollateralTokenMetadata } from "../../services/CollateralTokenService";
import { createMarket, getEscrowStatus, getMarketById, getMarketOutcomeTokens, getMarkets, getTokenWhiteListWithDefaultMetadata, MarketFilters, MarketFormValues } from "../../services/MarketService";
import { seedPool, exitPool, SeedPoolFormValues, seedScalarMarket, SeedScalarMarketFormValues } from "../../services/PoolService";
import { Reducers } from "../reducers";
import { setMarketEscrowStatus, appendResolutingMarkets, appendMarkets, setMarketErrors, setMarketLoading, setMarketDetail, setMarkets, setResolutingMarkets, setMarketEditLoading, setMarketPoolTokenBalance, setMarketDetailTokens, setTokenWhitelist, setPendingMarkets, appendPendingMarkets } from "./market";

export function createNewMarket(values: MarketFormValues) {
    return async (dispatch: Function) => {
        try {
            dispatch(setMarketEditLoading(true));

            await createMarket(values);

            dispatch(setMarketEditLoading(false));
        } catch (error) {
            dispatch(setMarketEditLoading(false));
            console.error('[createNewMarket]', error);
        }
    };
}

export function loadMarket(id: string) {
    return async (dispatch: Function, getState: () => Reducers) => {
        try {
            const store = getState();
            dispatch(setMarketLoading(true));
            dispatch(setMarketDetail(undefined));
            dispatch(setMarketPoolTokenBalance(undefined));
            dispatch(setMarketEscrowStatus([]));

            const market = await getMarketById(id);

            if (!market) {
                dispatch(setMarketErrors(['Could not find market']));
                return;
            }

            const account = store.account.account;

            if (account) {
                const escrowStatusRequest = getEscrowStatus(id, account.accountId);
                const token = await getPoolBalanceForMarketByAccount(account.accountId, id);
                const escrowStatus = await escrowStatusRequest;

                dispatch(setMarketEscrowStatus(escrowStatus));

                if (token) {
                    dispatch(setMarketPoolTokenBalance(token));
                }
            }

            dispatch(setMarketDetail(market));
            dispatch(setMarketLoading(false));
        } catch (error) {
            dispatch(setMarketLoading(false));
            console.error('[loadMarket]', error);
        }
    };
}

export function reloadTokens(marketId: string, collateralToken: TokenViewModel) {
    return async (dispatch: Function, getState: () => Reducers) => {
        const store = getState();
        const tokens = await getMarketOutcomeTokens(marketId, collateralToken, store.account.account ?? undefined);
        if (tokens.length === 0) return;

        dispatch(setMarketDetailTokens(tokens));
    }
}

export function fetchMarkets(filters: MarketFilters, append?: boolean) {
    return async (dispatch: Function) => {
        try {
            dispatch(setMarketLoading(true));
            const markets = await getMarkets({
                ...filters,
                finalized: false,
                expired: false,
            });

            if (append) {
                dispatch(appendMarkets(markets));
            } else {
                dispatch(setMarkets(markets));
            }

            dispatch(setMarketLoading(false));
        } catch (error) {
            dispatch(setMarketLoading(false));
            console.error('[fetchMarkets]', error);
        }
    }
}

export function fetchPendingMarkets(filters: MarketFilters, append?: boolean) {
    return async (dispatch: Function) => {
        try {
            dispatch(setMarketLoading(true));
            const markets = await getMarkets({
                ...filters,
                expired: true,
                finalized: false,
            });

            if (append) {
                dispatch(appendPendingMarkets(markets));
            } else {
                dispatch(setPendingMarkets(markets));
            }

            dispatch(setMarketLoading(false));
        } catch (error) {
            dispatch(setMarketLoading(false));
            console.error('[fetchPendingMarkets]', error);
        }
    }
}

export function fetchResolutingMarkets(filters: MarketFilters, append?: boolean) {
    return async (dispatch: Function) => {
        try {
            dispatch(setMarketLoading(true));

            const markets = await getMarkets({
                ...filters,
                expired: true,
                finalized: true,
            });

            if (append) {
                dispatch(appendResolutingMarkets(markets));
            } else {
                dispatch(setResolutingMarkets(markets));
            }

            dispatch(setMarketLoading(false));
        } catch (error) {
            dispatch(setMarketLoading(false));
            console.error('[fetchResolutingMarkets]', error);
        }
    }
}

export function seedPoolAction(marketId: string, tokenId: string, values: SeedPoolFormValues) {
    return async (dispatch: Function) => {
        await seedPool(marketId, tokenId, values);
    }
}

export function seedScalarMarketAction(market: MarketViewModel, values: SeedScalarMarketFormValues) {
    return async (dispatch: Function) => {
        await seedScalarMarket(market, values);
    }
}

export function exitPoolAction(marketId: string, amountIn: string) {
    return async (dispatch: Function) => {
        await exitPool(marketId, amountIn);
    }
}

export function loadTokenWhitelist() {
    return async (dispatch: Function) => {
        // First create a dummy list
        const whitelist = await getTokenWhiteListWithDefaultMetadata();
        dispatch(setTokenWhitelist(whitelist));

        // Now we are going to fill in the real metadata
        const metadataPromises = Object.values(whitelist).map((metadata) => {
            return getCollateralTokenMetadata(metadata.collateralTokenId);
        });

        const realMetadata = await Promise.all(metadataPromises);
        dispatch(setTokenWhitelist(realMetadata));
    }
}
