import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MarketViewModel } from '../../models/Market';
import { PoolToken } from '../../models/PoolToken';
import { TokenViewModel } from '../../models/TokenViewModel';

export type MarketState = Readonly<{
    markets: MarketViewModel[];
    resolutingMarkets: MarketViewModel[];
    marketDetail?: MarketViewModel;
    marketError?: string[];
    marketLoading: boolean;
    editLoading: boolean,
    poolTokenBalance?: PoolToken;
}>;

const initialState: MarketState = {
    marketLoading: false,
    editLoading: false,
    markets: [],
    resolutingMarkets: [],
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
} = marketsSlice.actions;

export default marketsSlice.reducer;
