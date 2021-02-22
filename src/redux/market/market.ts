import { EscrowStatus } from '@fluxprotocol/amm-sdk/dist/models/EscrowStatus';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MarketViewModel } from '../../models/Market';
import { PoolToken } from '../../models/PoolToken';
import { TokenMetadata } from '../../models/TokenMetadata';
import { TokenViewModel } from '../../models/TokenViewModel';

export type MarketState = Readonly<{
    markets: MarketViewModel[];
    resolutingMarkets: MarketViewModel[];
    pendingMarkets: MarketViewModel[];
    marketDetail?: MarketViewModel;
    escrowStatus: EscrowStatus[];
    marketError?: string[];
    marketLoading: boolean;
    editLoading: boolean,
    poolTokenBalance?: PoolToken;
    tokenWhitelist: TokenMetadata[];
}>;

const initialState: MarketState = {
    marketLoading: false,
    editLoading: false,
    markets: [],
    pendingMarkets: [],
    escrowStatus: [],
    resolutingMarkets: [],
    tokenWhitelist: [],
};

const marketsSlice = createSlice({
    initialState,
    name: 'markets',
    reducers: {
        setMarketErrors(state: MarketState, action: PayloadAction<string[]>): MarketState {
            return ({
                ...state,
                marketError: action.payload,
            });
        },
        setTokenWhitelist(state: MarketState, action: PayloadAction<TokenMetadata[]>): MarketState {
            return ({
                ...state,
                tokenWhitelist: action.payload,
            });
        },
        setMarketLoading(state: MarketState, action: PayloadAction<boolean>): MarketState {
            return ({
                ...state,
                marketLoading: action.payload,
            });
        },
        setMarketEditLoading(state: MarketState, action: PayloadAction<boolean>): MarketState {
            return ({
                ...state,
                editLoading: action.payload,
            });
        },
        setPendingMarkets(state: MarketState, action: PayloadAction<MarketViewModel[]>): MarketState {
            return ({
                ...state,
                pendingMarkets: action.payload,
            });
        },
        appendPendingMarkets(state: MarketState, action: PayloadAction<MarketViewModel[]>): MarketState {
            return ({
                ...state,
                pendingMarkets: [...action.payload, ...state.pendingMarkets],
            });
        },
        setMarkets(state: MarketState, action: PayloadAction<MarketViewModel[]>): MarketState {
            return ({
                ...state,
                markets: action.payload,
            });
        },
        appendMarkets(state: MarketState, action: PayloadAction<MarketViewModel[]>): MarketState {
            return ({
                ...state,
                markets: [...action.payload, ...state.markets],
            });
        },
        setResolutingMarkets(state: MarketState, action: PayloadAction<MarketViewModel[]>): MarketState {
            return ({
                ...state,
                resolutingMarkets: action.payload,
            });
        },
        appendResolutingMarkets(state: MarketState, action: PayloadAction<MarketViewModel[]>): MarketState {
            return ({
                ...state,
                resolutingMarkets: [...action.payload, ...state.resolutingMarkets],
            });
        },
        setMarketDetail(state: MarketState, action: PayloadAction<MarketViewModel | undefined>): MarketState {
            return ({
                ...state,
                marketDetail: action.payload,
            });
        },
        setMarketDetailTokens(state: MarketState, action: PayloadAction<TokenViewModel[]>): MarketState {
            if (!state.marketDetail) {
                return state;
            }

            return ({
                ...state,
                marketDetail: {
                    ...state.marketDetail,
                    outcomeTokens: action.payload,
                },
            });
        },
        setMarketPoolTokenBalance(state: MarketState, action: PayloadAction<PoolToken | undefined>): MarketState {
            return ({
                ...state,
                poolTokenBalance: action.payload,
            });
        },
        setMarketEscrowStatus(state: MarketState, action: PayloadAction<EscrowStatus[]>): MarketState {
            return ({
                ...state,
                escrowStatus: action.payload,
            });
        },
    },
});

export const {
    setMarketErrors,
    setMarketLoading,
    setMarkets,
    setResolutingMarkets,
    setMarketDetail,
    setMarketEditLoading,
    appendMarkets,
    setMarketPoolTokenBalance,
    setMarketDetailTokens,
    setTokenWhitelist,
    appendPendingMarkets,
    setPendingMarkets,
    appendResolutingMarkets,
    setMarketEscrowStatus,
} = marketsSlice.actions;

export default marketsSlice.reducer;
