interface EarnedFeesGraphData {
    fees: string;
    outcomeId: number;
    poolId: string;
    balance: string;
    market: {
        description: string;
    }
}

export interface GraphAcountBalancesResponse {
    earned_fees: EarnedFeesGraphData[];
    balances: {
        balance: string;
        outcome_id: number;
    }[];
}

export interface PoolToken {
    outcomeId: number;
    poolId: string;
    fees: string;
    balance: string;
    marketDescription: string;
    marketId: string;
}

export function transformToPoolToken(graphData: EarnedFeesGraphData): PoolToken {
    return {
        balance: graphData.balance,
        fees: graphData.fees,
        marketDescription: graphData.market.description,
        marketId: graphData.poolId,
        outcomeId: graphData.outcomeId,
        poolId: graphData.poolId,
    }
}
