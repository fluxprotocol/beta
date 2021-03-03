import { TokenViewModel } from "../models/TokenViewModel";

export interface SwapFormValues {
    type: string;
    fromToken: TokenViewModel;
    toToken: TokenViewModel;
    amountIn: string;
    formattedAmountIn: string;
    amountOut: string;
    formattedAmountOut: string;
    newPrices: number[];
}
