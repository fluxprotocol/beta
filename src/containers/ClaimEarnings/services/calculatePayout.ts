import { EscrowStatus } from "@fluxprotocol/amm-sdk/dist/models/EscrowStatus";
import Big from "big.js";
import { PoolToken } from "../../../models/PoolToken";
import { TokenViewModel } from "../../../models/TokenViewModel";

export function calculatePayout(tokens: TokenViewModel[], payoutNumerator: string[] | null, escrowStatus: EscrowStatus[], poolToken?: PoolToken): Big {
    let claimable = new Big(0);

    // First add fees
    if (poolToken) {
        claimable = claimable.add(poolToken.fees);
    }

    // Token balance * payout numerator
    if (payoutNumerator) {
        const escrowValidMarket = escrowStatus.find(status => status.type === 'valid_escrow');
        const numerators = payoutNumerator.map(n => new Big(n));

        numerators.forEach((num, outcome) => {
            const token = tokens.find(token => token.outcomeId === outcome);
            if (!token) return;

            const payout = new Big(token.balance).mul(num.div(`1e${token.decimals}`));

            claimable = claimable.add(payout);
        });

        if (escrowValidMarket) {
            claimable = claimable.add(escrowValidMarket.total_amount);
        }
    }

    return claimable;
}
