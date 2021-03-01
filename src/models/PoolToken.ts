import Big from 'big.js';
import { formatCollateralToken } from '../services/CollateralTokenService';
import trans from '../translation/trans';
import { TokenMetadata } from './TokenMetadata';
import { TokenViewModel } from './TokenViewModel';
import { GraphUserBalancesItem } from './UserBalance';

export interface EarnedFeesGraphData {
    fees: string;
    outcomeId: number;
    poolId: string;
    balance: string;
    market?: {
        description: string;
        pool: {
            collateral_token_id: string;
        }
    }
}

export interface GraphAcountBalancesResponse {
    earned_fees: EarnedFeesGraphData[];
    balances: GraphUserBalancesItem[];
}

export interface PoolToken {
    outcomeId: number;
    poolId: string;
    fees: string;
    collateralTokenDecimals: number;
    balance: string;
    balanceFormatted: string;
    marketDescription: string;
    marketId: string;
}

export function transformToPoolToken(graphData: EarnedFeesGraphData, collateralTokenMetadata: TokenMetadata): PoolToken {
    return {
        balanceFormatted: formatCollateralToken(graphData.balance, collateralTokenMetadata.decimals),
        balance: graphData.balance,
        fees: graphData.fees,
        marketDescription: graphData.market?.description ?? '',
        marketId: graphData.poolId,
        outcomeId: graphData.outcomeId,
        poolId: graphData.poolId,
        collateralTokenDecimals: collateralTokenMetadata.decimals ?? 18,
    }
}

export function transformPoolTokenToTokenViewModel(pooltoken: PoolToken): TokenViewModel {
    return {
        balance: pooltoken.balance,
        balanceFormatted: pooltoken.balanceFormatted,
        decimals: pooltoken.collateralTokenDecimals,
        odds: new Big(0),
        outcomeId: NaN,
        poolBalance: '0',
        poolWeight: new Big(0),
        price: 0,
        spent: "0",
        priceSymbol: '$',
        priceSymbolPosition: 'left',
        tokenName: trans('global.poolToken'),
        tokenSymbol: '',
        weight: 0,
        isCollateralToken: false,
        bound: new Big(0),
    };
}
