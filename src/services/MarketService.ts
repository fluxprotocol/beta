import { gql } from '@apollo/client';
import { format } from 'date-fns';

import { FetchResult, FetchResultType } from '../models/FetchResult';
import { GraphMarketResponse, MarketCategory, MarketViewModel, transformToMarketViewModel } from '../models/Market';
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
    const mainTokenResponse = await getMainToken();

    try {
        const result = await graphqlClient.query({
            query: gql`
                query Market($id: String!) {
                    market: getMarket(marketId: $id) {
                        pool {
                            public
                            owner
                            pool_balances {
                                weight
                                outcome_id
                                balance
                                price
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
                }
            `,
            variables: {
                id: marketId,
            }
        });

        return transformToMarketViewModel(result.data.market);
    } catch (error) {
        console.error('[getMarketById]', error);
        return null;
    }

}

export interface MarketFilters {
    categories?: MarketCategory[];
    expired?: boolean;
}

export async function getMarkets(filters: MarketFilters): Promise<MarketViewModel[]> {
    try {
        const result = await graphqlClient.query<any>({
            query: gql`
                query Markets($expired: Boolean, $categories: [String]) {
                    market: getMarkets(filters: { expired: $expired, categories: $categories }) {
                        items {
                            pool {
                                public
                                owner
                                pool_balances {
                                    weight
                                    outcome_id
                                    balance
                                    price
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
            }
        });

        return result.data.market.items.map((market: GraphMarketResponse) => transformToMarketViewModel(market));
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

export function formatResolutionDate(resolutionDate: Date): string {
    return format(resolutionDate, 'MMMM d, yyyy HH:mm');
}
