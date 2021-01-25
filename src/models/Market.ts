import { PoolBalanceViewModel } from "./PoolBalance";
import { TokenViewModel } from "./TokenViewModel";
import BN from 'bn.js';
import { PoolBalanceViewModel, transformToPoolBalanceViewModel } from "./PoolBalance";

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
}

export interface GraphMarketResponse {
    description: string;
    outcome_tags: string[];
    end_time: string;
    extra_info: string;
    finalized: boolean;
    id: string;
    pool: {
        public: boolean;
        owner: string;
        pool_balances: {
            weight: string;
            outcome_id: number;
            balance: string;
            price: number;
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
    outcomes: PoolBalanceViewModel[];
    volume: string;
    category: (MarketCategory | string)[];
    extraInfo: string;
    collateralToken: string;
}

export function transformToMarketViewModel(graphResponse: GraphMarketResponse): MarketViewModel {
    const outcomes = transformToPoolBalanceViewModel(graphResponse.pool.pool_balances as any, graphResponse.outcome_tags);

    return {
        id: graphResponse.id,
        category: [],
        description: graphResponse.description,
        extraInfo: graphResponse.extra_info,
        finalized: graphResponse.finalized,
        outcomes,
        owner: graphResponse.pool.owner,
        resolutionDate: new Date(parseInt(graphResponse.end_time)),
        public: graphResponse.pool.public,
        volume: '0',
    }
}
