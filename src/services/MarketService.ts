import { gql } from '@apollo/client';
import FluxSdk from '@fluxprotocol/amm-sdk';
import Big from 'big.js';
import { format } from 'date-fns';
import { DEFAULT_FEE } from '../config';

import { GraphMarketResponse, MarketCategory, MarketType, MarketViewModel, transformToMarketViewModel } from '../models/Market';
import { TokenMetadata } from '../models/TokenMetadata';
import { TokenViewModel, transformToMainTokenViewModel, transformToTokenViewModels } from '../models/TokenViewModel';
import { UserBalance } from '../models/UserBalance';
import trans from '../translation/trans';
import { getAccountInfo, getBalancesForMarketByAccount } from './AccountService';
import { createDefaultTokenMetadata, getCollateralTokenMetadata } from './CollateralTokenService';
import createProtocolContract from './contracts/ProtocolContract';
import { graphqlClient } from './GraphQLService';
import { connectSdk } from './WalletService';

export interface MarketFormValues {
    type: MarketType;
    isCategoricalMarket: boolean;
    categories: MarketCategory[];
    resolutionDate: Date;
    description: string;
    outcomes: string[];
    extraInfo: string;
    collateralTokenId: string;
    lowerBound: Big;
    upperBound: Big;
}

function createOutcomes(values: MarketFormValues): string[] {
    if (values.type === MarketType.Categorical) {
        return values.outcomes;
    }

    if (values.type === MarketType.Scalar) {
        return [
            values.lowerBound.toString(),
            values.upperBound.toString(),
        ];
    }

    return [
        trans('market.outcomes.yes'),
        trans('market.outcomes.no'),
    ];
}

export async function createMarket(values: MarketFormValues): Promise<void> {
    try {
        const protocol = await createProtocolContract();
        const outcomes = createOutcomes(values);
        const tokenMetadata = await getCollateralTokenMetadata(values.collateralTokenId);
        const formattedFee = 100 / DEFAULT_FEE;

        protocol.createMarket(
            values.description,
            outcomes,
            values.categories,
            values.resolutionDate,
            new Big(`1e${tokenMetadata.decimals}`).div(formattedFee).toString(),
            values.collateralTokenId,
            values.extraInfo,
            values.type === MarketType.Scalar,
        );
    } catch (error) {
        console.error('[createMarket]', error);
    }
}

export async function getMarketById(marketId: string): Promise<MarketViewModel | null> {
    try {
        const account = await getAccountInfo();
        const accountId = account?.accountId;
        const result = await graphqlClient.query({
            query: gql`
                query Market($id: String!, $accountId: String) {
                    market: getMarket(marketId: $id) {
                        pool {
                            owner
                            collateral_token_id
                            pool_balances {
                                weight
                                outcome_id
                                balance
                                price
                                odds
                            }
                            tokens_info {
                                is_pool_token
                                total_supply
                            }
                        }
                        description
                        outcome_tags
                        end_time
                        extra_info
                        finalized
                        id
                        volume
                        categories
                        creation_date
                        payout_numerator
                        is_scalar
                        claimed_earnings(accountId: $accountId) {
                            payout
                        }
                    }
                }
            `,
            variables: {
                id: marketId,
                accountId,
            }
        });

        const market: GraphMarketResponse = result.data.market;
        let balances: UserBalance[] = [];

        if (accountId) {
            balances = await getBalancesForMarketByAccount(accountId, marketId);
        }

        const collateralToken = await transformToMainTokenViewModel(market.pool.collateral_token_id, accountId);

        return transformToMarketViewModel(market, collateralToken, balances);
    } catch (error) {
        console.error('[getMarketById]', error);
        return null;
    }

}

export interface MarketFilters {
    categories?: MarketCategory[];
    expired?: boolean;
    finalized?: boolean;
    limit?: number;
    offset?: number;
}

export async function getMarkets(filters: MarketFilters): Promise<MarketViewModel[]> {
    try {
        const result = await graphqlClient.query<any>({
            query: gql`
                query Markets($expired: Boolean, $categories: [String], $limit: Int, $offset: Int, $finalized: Boolean) {
                    market: getMarkets(filters: { expired: $expired, categories: $categories, limit: $limit, offset: $offset, finalized: $finalized }) {
                        items {
                            pool {
                                owner
                                collateral_token_id
                                pool_balances {
                                    weight
                                    outcome_id
                                    balance
                                    price
                                    odds
                                }
                            }
                            description
                            outcome_tags
                            end_time
                            extra_info
                            finalized
                            id
                            volume
                            categories
                            is_scalar
                        }
                        total
                    }
                }
            `,
            variables: {
                expired: filters.expired,
                categories: filters.categories,
                limit: filters.limit,
                offset: filters.offset,
                finalized: filters.finalized,
            }
        });

        const marketsPromises = result.data.market.items.map(async (market: GraphMarketResponse) => {
            const collateralToken = await transformToMainTokenViewModel(market.pool.collateral_token_id);
            return transformToMarketViewModel(market, collateralToken);
        });

        return Promise.all(marketsPromises);
    } catch (error) {
        console.error('[getMarketById]', error);
        return [];
    }
}

export async function getMarketOutcomeTokens(marketId: string, collateralToken?: TokenViewModel): Promise<TokenViewModel[]> {
    try {
        const result = await graphqlClient.query({
            fetchPolicy: 'network-only',
            query: gql`
                query MarketOutcomeTokens($id: String!) {
                    market: getMarket(marketId: $id) {
                        pool {
                            pool_balances {
                                weight
                                outcome_id
                                balance
                                price
                                odds
                            }
                        }
                        outcome_tags
                        is_scalar
                    }
                }
            `,
            variables: {
                id: marketId,
            }
        });

        const market: GraphMarketResponse = result.data.market;
        const account = await getAccountInfo();
        const accountId = account?.accountId;
        let balances: UserBalance[] = [];

        if (accountId) {
            balances = await getBalancesForMarketByAccount(accountId, marketId);
        }

        return transformToTokenViewModels(
            market.outcome_tags,
            market.pool.pool_balances as any,
            balances,
            market.is_scalar ? MarketType.Scalar : MarketType.Categorical,
            false,
            collateralToken,
        );
    } catch (error) {
        console.error('[getMarketOutcomeTokens]', error);
        return [];
    }
}

export async function getResolutingMarkets(): Promise<MarketViewModel[]> {
    try {
        return getMarkets({
            expired: true,
            finalized: true,
        });
    } catch (error) {
        console.error('[getMarketById]', error);
        return [];
    }
}

export async function claimEarningsForMarket(marketId: string) {
    const protocol = await createProtocolContract();
    protocol.claimEarnings(marketId);
}

export function formatResolutionDate(resolutionDate: Date): string {
    return format(resolutionDate, 'MMMM d, yyyy HH:mm');
}

/**
 * Checks whether or not user is eligible for swapping their shares for a collateral token
 *
 * @export
 * @param {TokenViewModel[]} tokens
 * @return {boolean}
 */
export function isEligibleForRedeeming(tokens: TokenViewModel[]): boolean {
    return !tokens.some(token => token.balance === '0');
}

export function getEligibleAmountForRedeeming(tokens: TokenViewModel[]): Big {
    if (!isEligibleForRedeeming(tokens)) {
        return new Big(0);
    }

    let lowestBalance = new Big(tokens[0].balance);

    tokens.forEach((token) => {
        const balance = new Big(token.balance);

        if (balance.lt(lowestBalance)) {
            lowestBalance = balance;
        }
    });

    return lowestBalance;
}

export async function burnOutcomeTokensRedeemCollateral(marketId: string, toBurn: string) {
    const sdk = await connectSdk();
    await sdk.burnOutcomeTokensRedeemCollateral(marketId, toBurn);
}

export async function getTokenWhiteListWithDefaultMetadata(): Promise<TokenMetadata[]> {
    const sdk = await connectSdk();
    const whitelist = await sdk.getTokenWhitelist();
    return whitelist.map(token => createDefaultTokenMetadata(token.tokenId));
}

export async function getEscrowStatus(marketId: string, accountId: string) {
    const sdk = await connectSdk();
    return sdk.getEscrowStatus(marketId, accountId);
}

export function getScalarBounds(bounds: Big[]): { lowerBound: Big, upperBound: Big } {
    const sortedBounds = FluxSdk.utils.sortBig(bounds);

    return {
        lowerBound: sortedBounds[0],
        upperBound: sortedBounds[sortedBounds.length - 1],
    }
}

interface ScalarLongShortTokensResult {
    longToken: TokenViewModel,
    shortToken: TokenViewModel,
    lowerBound: Big,
    upperBound: Big,
}

export function getScalarLongShortTokens(tokens: TokenViewModel[]): ScalarLongShortTokensResult {
    const bounds = getScalarBounds(tokens.map(t => t.bound));

    return {
        longToken: tokens.find(t => t.bound.eq(bounds.upperBound)) as TokenViewModel,
        shortToken: tokens.find(t => t.bound.eq(bounds.lowerBound)) as TokenViewModel,
        lowerBound: bounds.lowerBound,
        upperBound: bounds.upperBound,
    }
}
