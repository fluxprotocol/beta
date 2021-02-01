import React, { useEffect, useState } from 'react';
import InputAdornment from '@material-ui/core/InputAdornment';

import Button from '../../components/Button';
import Label from '../../components/Label';
import TextInput from '../../components/TextInput';
import { Account } from '../../models/Account';
import { MarketViewModel } from '../../models/Market';
import trans from '../../translation/trans';
import WrongOwnerMessage from './components/WrongOwnerMessage/WrongOwnerMessage';
import createDefaultSeedPoolFormValues from './services/createDefaultSeedPoolFormValues';
import { validateSeedPool } from './services/validateSeedPool';
import { TokenViewModel } from '../../models/TokenViewModel';
import TokenSelect from '../TokenSelect';
import { SeedPoolFormValues } from '../../services/PoolService';

import s from './SeedPool.module.scss';
import Error from '../../components/Error';

interface Props {
    market: MarketViewModel;
    mainToken: TokenViewModel;
    account: Account | null,
    onSeedPool: (values: SeedPoolFormValues) => void;
    onFinalizePool: () => void;
}

export default function SeedPool({
    market,
    account,
    mainToken,
    onSeedPool,
    onFinalizePool,
}: Props) {
    const [formValues, setFormValues] = useState(createDefaultSeedPoolFormValues());

    function handlePercentageChange(index: number, value: string) {
        const percentages = formValues.outcomePercentages;
        percentages[index] = Number(value);

        setFormValues({
            ...formValues,
            outcomePercentages: percentages
        });
    }

    function handleMainTokenChange(value: string) {
        setFormValues({
            ...formValues,
            mainTokenInput: value,
        });
    }

    useEffect(() => {
        setFormValues({
            ...formValues,
            outcomePercentages: market.outcomeTokens.map(() => 0)
        });
    }, [market.outcomeTokens]);

    const errors = validateSeedPool(formValues, market);

    return (
        <div>
            {(account?.accountId !== market.owner) && <WrongOwnerMessage market={market} />}

            {(account?.accountId === market.owner && (
                <form>
                    <p>{trans('seedPool.explanation')}</p>

                    <div className={s.inputWrapper}>
                        <div className={s.tokenTitles}>
                            <span>{trans('global.balance', {}, true)}: {mainToken.balanceFormatted}</span>
                        </div>

                        <TokenSelect
                            onTokenSwitch={() => {}}
                            value={formValues.mainTokenInput.toString()}
                            tokens={[mainToken]}
                            selectedToken={mainToken}
                            onValueChange={handleMainTokenChange}
                            placeholder="1000"
                        />
                        <Error error={errors.mainTokenInput} />
                    </div>

                    <h3>{trans('seedPool.weightsTitle')}</h3>
                    {formValues.outcomePercentages.map((percentage, index) => (
                        <div className={s.inputWrapper} key={index}>
                            <Label text={market.outcomeTokens.find(outcome => outcome.outcomeId === index)?.tokenName || ""} />
                            <TextInput
                                value={percentage.toString()}
                                type="number"
                                onChange={(value) => handlePercentageChange(index, value)}
                                error={!!errors.outcomePercentages[index]}
                                helperText={errors.outcomePercentages[index]}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <span className={s.adornement}>%</span>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </div>
                    ))}

                    {!errors.canSeed && <p>{errors.message}</p>}

                    <Button
                        className={s.confirmButton}
                        disabled={!errors.canSeed}
                        onClick={() => onSeedPool(formValues)}
                    >
                        {market.seedNonce === '1' ? trans('seedPool.action.submit') : trans('seedPool.action.reSeed')}
                    </Button>
                    <Button
                        className={s.confirmButton}
                        disabled={!errors.canPublish}
                        onClick={() => onFinalizePool()}
                    >
                        {trans('seedPool.action.finalize')}
                    </Button>
                </form>
            ))}
        </div>
    );
}
