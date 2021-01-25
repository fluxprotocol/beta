import { gql } from '@apollo/client';
import { PriceHistoryData } from '../models/PriceHistoryData';
import { sleep } from '../utils/sleep';
import { graphqlClient } from './GraphQLService';


export async function getPricesHistoryByMarketId(marketId: string): Promise<PriceHistoryData[]> {
    try {
        const result = await graphqlClient.query({
            query: gql`
                query PriceHistory($marketId: String!, $beginTimestamp: String!) {
                    history: getPriceHistory(poolId: $marketId, beginTimestamp: $beginTimestamp) {
                        pointKey
                        dataPoints {
                            outcome
                            price
                        }
                    }
                }
            `,
            variables: {
                marketId,
                beginTimestamp: "0"
            }
        });

        return result.data.history;
    } catch (error) {
        console.error('[getMarketById]', error);
        return [];
    }
}
