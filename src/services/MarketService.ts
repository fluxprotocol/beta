import { gql } from '@apollo/client';
import { format } from 'date-fns';
import { DEFAULT_LIMIT } from '../config';

import { FetchResult, FetchResultType } from '../models/FetchResult';
import { GraphMarketResponse, MarketCategory, MarketViewModel, transformToMarketViewModel } from '../models/Market';
import { transformToMainTokenViewModel } from '../models/TokenViewModel';
import { UserBalance } from '../models/UserBalance';
import { getAccountInfo, getBalancesForMarketByAccount } from './AccountService';
import createProtocolContract from './contracts/ProtocolContract';
import { graphqlClient } from './GraphQLService';

export interface MarketFormValues {
    isCategoricalMarket: boolean;
    categories: MarketCategory[];
    resolutionDate: Date;
    description: string;
    outcomes: string[];
    extraInfo: string;
}

export async function createMarket(values: MarketFormValues): Promise<FetchResult<any, string>> {
    try {
        const protocol = await createProtocolContract();
        const outcomes = values.outcomes.length > 2 ? values.outcomes : ['YES', 'NO'];

        protocol.createMarket(
            values.description,
            outcomes,
            values.categories,
            values.resolutionDate,
            values.extraInfo
        );

        return {
            type: FetchResultType.Success,
            data: {},
            status: 200,
        }
    } catch (error) {
        console.error('[createMarket]', error);
        return {
            type: FetchResultType.Error,
            error,
            status: 500,
        }
    }
}

export async function getMarketById(marketId: string): Promise<MarketViewModel | null> {
    try {
        const result = await graphqlClient.query({
            query: gql`
                query Market($id: String!) {
                    market: getMarket(marketId: $id) {
                        pool {
                            public
                            owner
                            seed_nonce
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
                        payout_numerator
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
    limit?: number;
    offset?: number;
}

export async function getMarkets(filters: MarketFilters): Promise<MarketViewModel[]> {
    try {
        const result = await graphqlClient.query<any>({
            query: gql`
                query Markets($expired: Boolean, $categories: [String], $limit: Int, $offset: Int) {
                    market: getMarkets(filters: { expired: $expired, categories: $categories, limit: $limit, offset: $offset }) {
                        items {
                            pool {
                                public
                                owner
                                collateral_token_id
                                seed_nonce
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
            }
        });

        const dummyMainToken = await transformToMainTokenViewModel('');
        const marketsPromises = result.data.market.items.map((market: GraphMarketResponse) => transformToMarketViewModel(market, dummyMainToken));

        return Promise.all(marketsPromises);
    } catch (error) {
        console.error('[getMarketById]', error);
        return [];
    }
}

export async function getResolutingMarkets(): Promise<MarketViewModel[]> {
    try {
        return getMarkets({
            expired: true,
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
