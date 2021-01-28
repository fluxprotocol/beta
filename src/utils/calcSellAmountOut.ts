import Big from "big.js";
import { newtonRaphson } from "@fvictorio/newton-raphson-method";

/** Using Omen's utility functions adjusted where necessary  **/
/**
 * Computes the amount of collateral that needs to be sold to get `shares` amount of shares. Returns null if the amount
 * couldn't be computed.
 *
 * @param sharesToSell The amount of shares that need to be sold
 * @param holdings How many tokens the market maker has of the outcome that is being sold
 * @param otherHoldings How many tokens the market maker has of the outcomes that are not being sold
 * @param fee The fee of the market maker, between 0 and 1
 */
export const calcSellAmountInCollateral = (
    sharesToSell: Big,
    outcomeId: number,
    poolBalances: Big[],
    fee: number,
): Big | null => {
    Big.DP = 90;
    if (outcomeId < 0 || outcomeId >= poolBalances.length) {
        throw new Error(`Outcome index '${outcomeId}' must be between 0 and '${poolBalances.length - 1}'`);
    }

    const holdings = poolBalances[outcomeId];
    const otherHoldings = poolBalances.filter((_, i) => outcomeId !== i);
    const f = (r: Big): Big => {
        // For three outcomes, where the first outcome is the one being sold, the formula is:
        // f(r) = ((y - R) * (z - R)) * (x  + a - R) - x*y*z
        // where:
        //   `R` is r / (1 - fee)
        //   `x`, `y`, `z` are the market maker holdings for each outcome
        //   `a` is the amount of outcomes that are being sold
        //   `r` (the unknown) is the amount of collateral that will be returned in exchange of `a` tokens
        const R = r.div(1 - fee)
        const firstTerm = otherHoldings.map(h => h.minus(R)).reduce((a, b) => a.mul(b));
        const secondTerm = holdings.plus(sharesToSell).minus(R);
        const thirdTerm = otherHoldings.reduce((a, b) => a.mul(b), holdings);
        return firstTerm.mul(secondTerm).minus(thirdTerm)
    };

    const r = newtonRaphson(f, 0, { maxIterations: 100 });

    if (r) {
        const amountToSell = new Big(r.toFixed(0));
        return amountToSell;
    }

    return null;
};
