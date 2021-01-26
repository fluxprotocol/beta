import { Account, Contract } from "near-api-js";
import { MAX_GAS, PROTOCOL_ACCOUNT_ID, STORAGE_DEFAULT } from "../../config";
import { SwapFormValues } from "../SwapService";
import { connectWallet } from "../WalletService";
import BN from "bn.js";

export class TokenContract {
    contract: Contract;

    constructor(account: Account, tokenAccountId: string) {
        this.contract = new Contract(account, tokenAccountId, {
            viewMethods: ['get_balance'],
            changeMethods: ['transfer_with_vault', 'register_account'],
        });
    }

    async registerAccount() {
        // @todo This is very inconvenient for UX
        // @ts-ignore
        return this.contract.register_account({
            account_id: this.contract.account.accountId,
        },
            MAX_GAS,
            STORAGE_DEFAULT,
        );
    }

    async getBalance(accountId: string): Promise<void> {
        // @ts-ignore
        return this.contract.get_balance({account_id: accountId});
    }

    async buy(
        marketId: string,
        values: SwapFormValues
    ): Promise<void> {
        console.log(values.amountOut)
        let payload = JSON.stringify({
            function: "buy",
            args: {
                market_id: marketId,
                outcome_target: values.toToken.outcomeId,
                min_shares_out: new BN(values.amountOut).mul(new BN("98")).div(new BN("100")).toString() // TODO: add default slippage check to amountOut and make it expectedAmountOut
            }
        });

        // @ts-ignore
        return this.contract.transfer_with_vault({
                receiver_id: PROTOCOL_ACCOUNT_ID,
                amount: values.amountIn,
                payload: payload
            },
            MAX_GAS,
            STORAGE_DEFAULT,
        );
    }

    async joinPool(marketId: string, amountIn: string) {
        let payload = JSON.stringify({
            function: "join_pool",
            args: {
                market_id: marketId,
            }
        });

        // @ts-ignore
        return this.contract.transfer_with_vault({
                receiver_id: PROTOCOL_ACCOUNT_ID,
                amount: amountIn,
                payload: payload
            },
            MAX_GAS,
            STORAGE_DEFAULT,
        );
    }

    async publishPool(marketId: string, amountIn: string) {
        let payload = JSON.stringify({
            function: "publish",
            args: {
                market_id: marketId,
            }
        });

        // @ts-ignore
        return this.contract.transfer_with_vault({
            receiver_id: PROTOCOL_ACCOUNT_ID,
            amount: amountIn,
            payload: payload
        },
            MAX_GAS,
            STORAGE_DEFAULT,
        );
    }
}

let tokenInstances: Map<string, TokenContract> = new Map();

// @ts-ignore
window.createTokenContract = createTokenContract;

export default async function createTokenContract(tokenAccountId: string): Promise<TokenContract> {
    const instance = tokenInstances.get(tokenAccountId)
    if (instance) {
        return instance;
    }

    const wallet = await connectWallet();
    const newInstance = new TokenContract(wallet.account(), tokenAccountId);

    tokenInstances.set(tokenAccountId, newInstance);

    return newInstance;
}
