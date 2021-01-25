import { gql } from "@apollo/client";
import { FetchResult, FetchResultType } from "../models/FetchResult";
import { TokenViewModel, transformToTokenViewModels } from "../models/TokenViewModel";
import { graphqlClient } from "./GraphQLService";

export async function getMarketOutcomeTokens(marketId: string): Promise<FetchResult<TokenViewModel[], string>> {
    try {
        const result = await graphqlClient.query({
            query: gql`
                query OutcomeTokens($marketId: String!) {
                    market: getMarket(marketId: $marketId) {
                        outcome_tags
                        pool {
                            pool_balances {
                                price
                                balance
                                weight
                                outcome_id
                            }
                        }
                    }
                }
            `,
            variables: {
                marketId,
            }
        });

        const market = result.data.market;

        return {
            type: FetchResultType.Success,
            data: transformToTokenViewModels(market.pool.pool_balances, market.outcome_tags),
            status: 200,
        }
    } catch (error) {
        console.error('[error]', error);
        return {
            type: FetchResultType.Error,
            error,
            status: 500,
        }
    }
}
