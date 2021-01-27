import React, { ReactElement, useState } from 'react';

import Button from '../../components/Button';
import { TokenViewModel } from '../../models/TokenViewModel';
import trans from '../../translation/trans';
import TokenSelect from '../TokenSelect';

import s from './LiquidityProvider.module.scss';

interface Props {
    token: TokenViewModel;
    onSubmit: (amountIn: string) => void;
}

export default function LiquidityProvider({
    token,
    onSubmit,
}: Props): ReactElement {
    const [liquidityAmount, setLiquidityAmount] = useState('0');

    function handleSubmit() {
        onSubmit(liquidityAmount);
    }

    return (
        <div>
            <p>
                {trans('liquidityProvider.description')}
            </p>
            <div className={s.header}>
                <span>{trans('market.label.youPay')}</span>
                <span>{trans('global.balance', {}, true)}: {token.balanceFormatted}</span>
            </div>
            <TokenSelect
                value={liquidityAmount}
                onValueChange={(v) => setLiquidityAmount(v)}
                onTokenSwitch={() => {}}
                selectedToken={token}
                tokens={[token]}
                className={s.tokenSelect}
            />
            <Button onClick={handleSubmit} className={s.confirm}>
                {trans('market.action.confirmLiquidity')}
            </Button>
        </div>
    );
}
