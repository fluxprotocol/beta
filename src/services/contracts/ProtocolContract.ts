import { Account, Contract } from "near-api-js";
import { FUNGIBLE_TOKEN_ACCOUNT_ID, MAX_GAS, PROTOCOL_ACCOUNT_ID, STORAGE_DEFAULT } from "../../config";
import { SwapFormValues } from "../SwapService";
import { connectWallet } from "../WalletService";

class ProtocolContract {
    contract: Contract;

    constructor(account: Account) {
        this.contract = new Contract(account, PROTOCOL_ACCOUNT_ID, {
            viewMethods: [],
            changeMethods: ['create_market', 'seed_pool', 'sell'],
        });
    }

    async createMarket(
        description: string,
        outcomes: string[],
        categories: string[],
        endDate: Date,
        extraInfo: string = '',
    ): Promise<void> {
        // @ts-ignore
        this.contract.create_market({
            description,
            extra_info: extraInfo,
            outcomes: outcomes.length,
            outcome_tags: outcomes,
            end_time: endDate.getTime().toString(),
            collateral_token_id: FUNGIBLE_TOKEN_ACCOUNT_ID,
            categories,
            swap_fee: "100000000000000",
        }, MAX_GAS, STORAGE_DEFAULT);
    }

    async seedPool(
        marketId: string,
        totalIn: string,
        denormWeights: string[],
    ): Promise<void> {
        // @ts-ignore
        this.contract.seed_pool({
            market_id: marketId,
            total_in: totalIn,
            denorm_weights: denormWeights,
        }, MAX_GAS, STORAGE_DEFAULT);
    }

    async sell(
        marketId: string, 
        values: SwapFormValues
    ): Promise<void> {
        // @ts-ignore
        this.contract.sell({
            market_id: marketId,
            collateral_out: values.amountOut,
            outcome_target: values.fromToken.outcomeId,
            max_shares_in: values.amountIn
        })
    }



}

let protocolInstance: ProtocolContract;

export default async function createProtocolContract(): Promise<ProtocolContract> {
    if (protocolInstance) {
        return protocolInstance;
    }

    const wallet = await connectWallet();
    protocolInstance = new ProtocolContract(wallet.account());

    return protocolInstance;
}
