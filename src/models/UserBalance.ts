export interface UserBalance {
    outcomeId: number;
    balance: string;
    marketId: string;
    marketDescription: string;
    outcomeTag: string;
}

export interface GraphUserBalancesItem {
    balance: string;
    outcome_id: number;
    pool_id: string;
    market?: {
        description: string;
        outcome_tags: string[];
    }
}

export interface GraphUserBalanceResponse {
    balances: GraphUserBalancesItem[];
}

export function transformToUserBalance(graphData: GraphUserBalancesItem): UserBalance {
    return {
        balance: graphData.balance,
        outcomeId: graphData.outcome_id,
        marketId: graphData.pool_id,
        marketDescription: graphData.market?.description || '',
        outcomeTag: graphData.market?.outcome_tags[graphData.outcome_id] || '',
    }
}
