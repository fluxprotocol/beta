import { gql } from "@apollo/client";
import { Account } from "../models/Account";
import { EarnedFeesGraphData, GraphAcountBalancesResponse, PoolToken, transformToPoolToken } from "../models/PoolToken";
import { GraphUserBalanceResponse, transformToUserBalance, UserBalance } from "../models/UserBalance";
import { getCollateralTokenMetadata } from "./CollateralTokenService";
import createAuthContract from "./contracts/AuthContract";
import { graphqlClient } from "./GraphQLService";
import { connectSdk } from "./WalletService";
import { ENABLE_WHITELIST } from "../config";

export async function signUserIn() {
    const sdk = await connectSdk();
    sdk.signIn();
}

export async function getAccountInfo(): Promise<Account | null> {
    const sdk = await connectSdk();

    if (!sdk.isSignedIn()) {
        return null;
    }

    let canUseApp = true;
    const accountId = sdk.getAccountId() ?? '';

    if (ENABLE_WHITELIST) {
        const auth = await createAuthContract();
        canUseApp = await auth.isAuthenticated(accountId);
    }

    return {
        accountId,
        balance: (await sdk.getNearBalance()).available,
        canUseApp,
    };
}

export async function signUserOut() {
    const sdk = await connectSdk();
    sdk.signOut();
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
                        earned_fees(removeZeroBalances: true, removeClaimedBalances: false) {
                            fees
                            outcomeId
                            poolId
                            balance
                            market {
                                description

                                pool {
                                    collateral_token_id
                                }
                            }
                        }
                        balances(removeZeroBalances: true, removeClaimedBalances: false) {
                            balance
                            outcome_id
                            pool_id
                            spent
                            market {
                                description
                                outcome_tags
                                end_time
                                finalized
                                payout_numerator

                                pool {
                                    collateral_token_id
                                    pool_balances{
                                        price
                                        outcome_id
                                    }
                                }
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

        // Find all collateral tokens
        let allCollateralTokenIds: string[] = accountBalances.earned_fees.map(item => item.market?.pool.collateral_token_id || '');
        allCollateralTokenIds.push(...accountBalances.balances.map(item => item.market?.pool.collateral_token_id || ''));
        allCollateralTokenIds = allCollateralTokenIds.filter(item => item);

        // Fetch all token metadata
        const tokensMetadata = await Promise.all(allCollateralTokenIds.map(item => getCollateralTokenMetadata(item)));

        // Transform the fees
        const poolTokens = accountBalances.earned_fees.map((data) => {
            const tokenMetadata = tokensMetadata.find(metadata => metadata.collateralTokenId === data.market?.pool.collateral_token_id);
            return transformToPoolToken(data, tokenMetadata!);
        });

        // Transform the balances
        const marketBalances = accountBalances.balances.map((data) => {
            const tokenMetadata = tokensMetadata.find(metadata => metadata.collateralTokenId === data.market?.pool.collateral_token_id);
            return transformToUserBalance(data, tokenMetadata!);
        });

        return {
            poolTokens,
            marketBalances,
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
                            spent,
                            market {
                                outcome_tags

                                pool {
                                    collateral_token_id
                                }
                            }
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
        const colletaralTokenIds = data.balances.map(item => item.market?.pool.collateral_token_id || '').filter(x => x);
        const tokenMetadata = await Promise.all(colletaralTokenIds.map(id => getCollateralTokenMetadata(id)));

        return data.balances.map((balance) => {
            const metadata = tokenMetadata.find(metadata => metadata.collateralTokenId === balance.market?.pool.collateral_token_id);
            return transformToUserBalance(balance, metadata!)
        });
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

                            market {
                                pool {
                                    collateral_token_id
                                }
                            }
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

        const collateralTokenMetadata = await getCollateralTokenMetadata(data[0].market?.pool.collateral_token_id || '');

        return transformToPoolToken(data[0], collateralTokenMetadata);
    } catch (error) {
        console.error('[getBalancesForMarketByAccount]', error);
        return null;
    }
}
