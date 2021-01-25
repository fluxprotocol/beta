import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TokenViewModel } from '../../models/TokenViewModel';

export type TokensState = Readonly<{
    mainToken: TokenViewModel | null;
    marketOutcomeTokens: TokenViewModel[];
    loading: boolean;
    errors: string[];
}>;

const initialState: TokensState = {
    mainToken: null,
    marketOutcomeTokens: [],
    loading: false,
    errors: [],
};

const tokensSlice = createSlice({
    initialState,
    name: 'dialogs',
    reducers: {
        setMainToken(state: TokensState, action: PayloadAction<TokenViewModel | null>): TokensState {
            return ({
                ...state,
                mainToken: action.payload,
            });
        },

        setMarketOutcomeTokens(state: TokensState, action: PayloadAction<TokenViewModel[]>): TokensState {
            return ({
                ...state,
                marketOutcomeTokens: action.payload,
            });
        },

        setTokensLoading(state: TokensState, action: PayloadAction<boolean>): TokensState {
            return ({
                ...state,
                loading: action.payload,
            });
        },

        setTokensError(state: TokensState, action: PayloadAction<string[]>): TokensState {
            return ({
                ...state,
                errors: action.payload,
            });
        },

    },
});

export const {
    setMainToken,
    setMarketOutcomeTokens,
    setTokensError,
    setTokensLoading,
} = tokensSlice.actions;

export default tokensSlice.reducer;
