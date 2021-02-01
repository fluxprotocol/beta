import { TokenViewModel, transformToTokenViewModels } from "./TokenViewModel";
import { UserBalance } from "./UserBalance";

export enum MarketCategory {
    Stocks = 'stocks',
    Esports = 'esports',
    Meme = 'meme',
    Politics = 'politics',
    Viral = 'viral',
    Crypto = 'crypto',
    Sports = 'sports',
    Startups = 'startups',
    Unknown = 'unknown',
    Beer = "beer"
}

export interface GraphMarketResponse {
    description: string;
    outcome_tags: string[];
    end_time: string;
    extra_info: string;
    finalized: boolean;
    id: string;
    volume: string;
    categories: string[];
    payout_numerator?: string[] | null;
    pool: {
        public: boolean;
        owner: string;
        collateral_token_id: string;
        pool_balances: {
            weight: string;
            outcome_id: number;
            balance: string;
            price: number;
        }[];
        tokens_info: {
            is_pool_token: boolean;
            total_supply: string;
        }[];
    }
}

export interface MarketViewModel {
    id: string;
    finalized: boolean;
    public: boolean;
    owner: string;
    description: string;
    resolutionDate: Date;
    volume: string;
    category: (MarketCategory | string)[];
    extraInfo: string;
    collateralTokenId: string;
    outcomeTokens: TokenViewModel[];
    collateralToken: TokenViewModel;
    invalid: boolean;
    payoutNumerator: string[] | null;
    poolTokenInfo: {
        totalSupply: string;
    };
}

export async function transformToMarketViewModel(
    graphResponse: GraphMarketResponse,
    collateralToken: TokenViewModel,
    userBalances: UserBalance[] = [],
): Promise<MarketViewModel> {
    const tokensInfo = graphResponse.pool.tokens_info || [];
    const poolTokenInfo = tokensInfo.find(info => info.is_pool_token);
    const payoutNumerator = graphResponse.payout_numerator ? graphResponse.payout_numerator : null;

    return {
        id: graphResponse.id,
        // category: graphResponse.categories || [],
        category: [MarketCategory.Beer],
        description: graphResponse.description,
        extraInfo: graphResponse.extra_info,
        finalized: graphResponse.finalized,
        owner: graphResponse.pool.owner,
        resolutionDate: new Date(parseInt(graphResponse.end_time)),
        public: graphResponse.pool.public,
        volume: graphResponse.volume,
        collateralTokenId: graphResponse.pool.collateral_token_id,
        collateralToken,
        invalid: graphResponse.finalized && payoutNumerator === null,
        payoutNumerator,
        outcomeTokens: transformToTokenViewModels(
            graphResponse.outcome_tags,
            graphResponse.pool.pool_balances as any,
            userBalances,
        ),
        poolTokenInfo: {
            totalSupply: poolTokenInfo?.total_supply || '0',
        }
    }
}
