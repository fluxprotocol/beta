import BN from "bn.js";

export interface PoolBalanceViewModel {
    outcomeId: number;
    price: number;
    weight: number;
    poolWeight: BN;
    outcomeLabel: string;
}

export interface PoolBalanceGraphData {
    id: string;
    pool_id: string;
    outcome_id: number;
    account_id: string;
    balance: string;
    price: number;
    weight: string;
}

export function transformToPoolBalanceViewModel(response: PoolBalanceGraphData[], outcomeTags: string[]) {
    const totalWeight = response
        .reduce((prev, current) => prev.add(new BN(current.weight)), new BN(0));

    return response.map((poolBalance) => {
        const poolWeight = new BN(poolBalance.weight).mul(new BN(100));
        const weight = poolWeight.divRound(totalWeight);

        return {
            outcomeId: poolBalance.outcome_id,
            outcomeLabel: outcomeTags[poolBalance.outcome_id],
            price: poolBalance.price,
            poolWeight,
            weight: weight.toNumber(),
        };
    });
}
