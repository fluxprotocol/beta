import BN from "bn.js";
// TODO ASK FRANKLIN
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

export function transformToPoolBalanceViewModel(response: PoolBalanceGraphData[], outcomeTags: string[]): PoolBalanceViewModel[] {
    // @todo write this in a simpler way (start with outcome tags and work your way back)
    if (!response.length) {
        return outcomeTags.map((tag, index) => ({
            outcomeId: index,
            outcomeLabel: tag,
            poolWeight: new BN('0'),
            price: 0,
            weight: 0,
        }));
    }

    const totalWeight = response
        .reduce((prev, current) => prev.add(new BN(current.weight)), new BN(0));

    return response.map((poolBalance) => {
        const poolWeight = new BN(poolBalance.weight);
        const base = new BN(poolBalance.weight).mul(new BN(100));
        const weight = base.divRound(totalWeight);

        return {
            outcomeId: poolBalance.outcome_id,
            outcomeLabel: outcomeTags[poolBalance.outcome_id],
            price: poolBalance.price,
            poolWeight,
            weight: weight.toNumber(), // TODO: wut?
        };
    }).sort((a, b) => a.outcomeId - b.outcomeId);
}
