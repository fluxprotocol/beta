export interface Pool {
    id: string;
    seed_nonce: string;
    owner: string;
    num_of_outcomes: number;
    collateral: string;
    swap_fee: string;
    total_withdrawn_fees: string;
    fee_pool_weight: string;
    block_height: string;
    public: boolean;
}
