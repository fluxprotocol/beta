import { gql } from '@apollo/client';
import { subDays, subMonths, subWeeks } from 'date-fns';
import { PriceHistoryData } from '../models/PriceHistoryData';
import { graphqlClient } from './GraphQLService';

export enum Period {
    OneDay = '1d',
    OneWeek = '1w',
    OneMonth = '1m',
    ThreeWeeks = '3w',
    All = 'all',
}

export async function getPricesHistoryByMarketId(marketId: string, period: Period): Promise<PriceHistoryData[]> {
    try {
        const now = new Date();
        let chosenPeriondDate = new Date();
        let metric = 'month';

        switch(period) {
            case Period.OneDay:
                chosenPeriondDate = subDays(now, 1);
                metric = 'hour'
                break;
            case Period.OneWeek:
                chosenPeriondDate = subWeeks(now, 1);
                metric = 'day';
                break;
            case Period.ThreeWeeks:
                chosenPeriondDate = subWeeks(now, 3);
                metric = 'day';
                break;
            case Period.OneMonth:
                chosenPeriondDate = subMonths(now, 1);
                metric = 'day';
                break;
            case Period.All:
                chosenPeriondDate = new Date(0);
                metric = 'week'
                break;
        }

        const result = await graphqlClient.query({
            query: gql`
                query MarketPriceHistory($marketId: String!, $beginTimestamp: String!, $dateMetric: DateMetric) {
                    history: getPriceHistory(poolId: $marketId, beginTimestamp: $beginTimestamp, dateMetric: $dateMetric) {
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
                beginTimestamp: chosenPeriondDate.getTime().toString(),
                dateMetric: metric,
            }
        });

        return result.data.history;
    } catch (error) {
        console.error('[getMarketById]', error);
        return [];
    }
}
