import { gql } from "@apollo/client";
import { NULL_CONTRACT } from "../config";
import { Account } from "../models/Account";
import { EarnedFeesGraphData, GraphAcountBalancesResponse, PoolToken, transformToPoolToken } from "../models/PoolToken";
import { GraphUserBalanceResponse, transformToUserBalance, UserBalance } from "../models/UserBalance";
import trans from "../translation/trans";
import { graphqlClient } from "./GraphQLService";
import { connectWallet } from "./WalletService";

export async function signUserIn() {
    const connectedWallet = await connectWallet();

    connectedWallet.requestSignIn(NULL_CONTRACT, trans('global.appName'));
}

export async function getAccountInfo(): Promise<Account | null> {
    const connectedWallet = await connectWallet();

    if (!connectedWallet.isSignedIn()) {
        return null;
    }

    const nearAccount = connectedWallet.account();

    return {
        accountId: 'peterflux' || nearAccount.accountId,
        balance: (await nearAccount.getAccountBalance()).available,
    };
}

export async function signUserOut() {
    const connectedWallet = await connectWallet();
    connectedWallet.signOut();
}

interface AccountBalancesInfo {
    poolTokens: PoolToken[];
    marketBalances: UserBalance[];
}

export async function getAccountBalancesInfo(accountId: string): Promise<AccountBalancesInfo> {
    try {
        const result = await graphqlClient.query({
            query: gql`
                query Account($accountId: String!) {
                    account: getAccount(accountId: $accountId) {
                        earned_fees {
                            fees
                            outcomeId
                            poolId
                            balance
                            market {
                                description
                            }
                        }
                        balances {
                            balance
                            outcome_id
                            pool_id
                            market {
                                description
                                outcome_tags
                                end_time
                                finalized
                                payout_numerator
                            }
                        }
                    }
                }
            `,
            variables: {
                accountId,
            }
        });

        const accountBalances: GraphAcountBalancesResponse = result.data.account;

        return {
            poolTokens: accountBalances.earned_fees.map(transformToPoolToken),
            marketBalances: accountBalances.balances.map(transformToUserBalance),
        };
    } catch (error) {
        console.error('[getPoolTokensByAccountId]', error);
        return {
             poolTokens: [],
             marketBalances: [],
        };
    }
}

export async function getBalancesForMarketByAccount(accountId: string, marketId: string): Promise<UserBalance[]> {
    try {
        const result = await graphqlClient.query({
            query: gql`
                query AccountMarketBalances($accountId: String!, $marketId: String) {
                    account: getAccount(accountId: $accountId) {
                        balances(poolId: $marketId) {
                            balance
                            outcome_id
                            pool_id,
                        }
                    }
                }
            `,
            variables: {
                accountId,
                marketId,
            }
        });

        const data: GraphUserBalanceResponse = result.data.account;
        return data.balances.map(transformToUserBalance);
} catch (error) {
    console.error('[getBalancesForMarketByAccount]', error);
        return [];
    }
}

export async function getPoolBalanceForMarketByAccount(accountId: string, marketId: string): Promise<PoolToken | null> {
    try {
        const result = await graphqlClient.query({
            query: gql`
                query AccountMarketPoolBalances($accountId: String!, $marketId: String) {
                    account: getAccount(accountId: $accountId) {
                        earned_fees(poolId: $marketId) {
                            balance
                            fees
                            outcomeId
                            poolId
                        }
                    }
                }
            `,
            variables: {
                accountId,
                marketId,
            }
        });

        const data: EarnedFeesGraphData[] = result.data.account.earned_fees;

        if (!data.length) {
            return null;
        }

        return transformToPoolToken(data[0]);
    } catch (error) {
        console.error('[getBalancesForMarketByAccount]', error);
        return null;
    }
}
