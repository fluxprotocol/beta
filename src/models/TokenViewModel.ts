import { PoolBalanceGraphData, transformToPoolBalanceViewModel } from "./PoolBalance";

export interface TokenViewModel {
    tokenName: string;
    balance: string;
    balanceFormatted: string;
    price: number;
    tokenSymbol: string;
    outcomeId: number;
}

export function generateTokenName(tokenName: string): string {
    if (tokenName.length <= 3) {
        return tokenName.toUpperCase();
    }

    const splitted = tokenName.split(' ');

    if (splitted.length === 2) {
        // Takes the first character of every spaced word
        // so for Kanye West it would be KW
        return (splitted[0][0] + splitted[1][0]).toUpperCase();
    } else if (splitted.length === 3) {
        // Same but for 3 letters
        return (splitted[0][0] + splitted[1][0] + splitted[2][0]).toUpperCase();
    }

    return tokenName.slice(0, 3).toUpperCase();
}


export function transformToTokenViewModels(
    response: PoolBalanceGraphData[],
    outcomeTags: string[] = [],
): TokenViewModel[] {
    const poolBalances = transformToPoolBalanceViewModel(response, outcomeTags);

    return poolBalances.map((poolBalance) => {
        return {
            balance: '0',
            balanceFormatted: '0',
            price: Number(poolBalance.price.toFixed(3)),
            tokenName: poolBalance.outcomeLabel,
            tokenSymbol: generateTokenName(poolBalance.outcomeLabel),
            outcomeId: poolBalance.outcomeId,
        };
    });
}
