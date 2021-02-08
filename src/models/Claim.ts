import { formatCollateralToken } from "../services/CollateralTokenService";

export interface GraphClaimResponse {
    payout: string;
}

export interface ClaimViewModel {
    payout: string;
    payoutFormatted: string;
}

export function transformToClaimViewModel(graphData: GraphClaimResponse): ClaimViewModel {
    return {
        payout: graphData.payout,
        payoutFormatted: formatCollateralToken(graphData.payout),
    }
}
