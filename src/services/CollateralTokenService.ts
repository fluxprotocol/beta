// import { utils } from 'near-api-js';
import Big from 'big.js';

import { BANANAS_NEAR_ACCOUNT_ID, WRAPPED_NEAR_ACCOUNT_ID } from "../config";
import { isFetchResultSuccesful } from "../models/FetchResult";
import { TokenMetadata } from '../models/TokenMetadata';
import cache from '../utils/cache';
import { getTokenPriceByTicker } from "./TokenPriceService";
import { connectSdk } from "./WalletService";
import wrappedNearIcon from '../assets/images/icons/wrapped-near.svg';
import bananaTokenIcon from '../assets/images/icons/banana-token.svg';

export function formatCollateralToken(amount: string, decimals: number, dp = 2): string {
    const denominator = new Big(10).pow(decimals);
    return new Big(amount).div(denominator).toFixed(dp);
}

export function toCollateralToken(amount: string, decimals: number): string {
    const denominator = new Big(10).pow(decimals);
    return new Big(amount).mul(denominator).toFixed(0);
}

export interface AccountTokenBalance {
    balance: string;
    balanceFormatted: string;
}

export async function getCollateralTokenBalance(tokenAccountId: string, accountId: string): Promise<string> {
    try {
        const sdk = await connectSdk();
        const balance = await sdk.getTokenBalance(tokenAccountId, accountId);

        return balance;
    } catch (error) {
        console.error('[getCollateralTokenBalance]', error);
        return '0';
    }
}

export async function getCollateralTokenPrice(tokenAccountId: string): Promise<number> {
    if (tokenAccountId === WRAPPED_NEAR_ACCOUNT_ID) {
        const response = await getTokenPriceByTicker('near');

        if (isFetchResultSuccesful(response)) {
            return response.data;
        }
    }

    return 0;
}

export function getTokenImageByCollateralAccountId(collateralTokenId: string): string | undefined {
    if (collateralTokenId === WRAPPED_NEAR_ACCOUNT_ID) {
        return wrappedNearIcon;
    } else if (collateralTokenId === BANANAS_NEAR_ACCOUNT_ID) {
        return bananaTokenIcon;
    }

    return undefined;
}

export function createDefaultTokenMetadata(collateralTokenId: string): TokenMetadata {
    return {
        decimals: 18,
        name: collateralTokenId,
        reference: '',
        symbol: collateralTokenId,
        version: '0',
        collateralTokenId,
        tokenImage: getTokenImageByCollateralAccountId(collateralTokenId),
    };
}

export async function getCollateralTokenMetadata(collateralTokenId: string): Promise<TokenMetadata> {
    const defaultMetadata = createDefaultTokenMetadata(collateralTokenId);

    try {
        if (!collateralTokenId) return defaultMetadata;

        const metadata = await cache(`metadata_${collateralTokenId}`, async () => {
            const sdk = await connectSdk();
            return sdk.getTokenMetadata(collateralTokenId);
        });

        return {
            ...defaultMetadata,
            ...metadata,
            collateralTokenId,
        };
    } catch (error) {
        console.error('[getCollateralTokenMetadata]', error);

        return defaultMetadata;
    }
}
