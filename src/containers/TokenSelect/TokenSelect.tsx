import React, { useCallback, useState } from 'react';
import classnames from 'classnames';

import { TokenViewModel } from '../../models/TokenViewModel';

import s from './TokenSelect.module.scss';
import trans from '../../translation/trans';
import Token from '../../components/Token';
import NonLinkButton from '../../components/NonLinkButton';
import TokenDropdown from './components/TokenDropdown/TokenDropdown';

interface Props {
    className?: string;
    selectedToken: TokenViewModel;
    tokens: TokenViewModel[];
    value: string;
    error?: string;
    showPrice?: boolean;
    onValueChange?: (newValue: string) => void;
    onTokenSwitch: (token: TokenViewModel) => void;
    placeholder?: string;
    disabledInput?: boolean;
    newPrice?: number;
}

export default function TokenSelect({
    selectedToken,
    tokens,
    value,
    onTokenSwitch,
    newPrice,
    onValueChange = () => {},
    showPrice = true,
    className = '',
    placeholder = '0',
    disabledInput = false,
}: Props) {
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const handleChangePairClick = useCallback(() => {
        setDropdownOpen(!isDropdownOpen);
    }, [isDropdownOpen]);

    const handleTokenClick = useCallback((token: TokenViewModel) => {
        setDropdownOpen(false);
        onTokenSwitch(token);
    }, [onTokenSwitch]);

    const priceClassName = classnames(s.price, {
        [s['price--symbol-right']]: selectedToken.priceSymbolPosition === 'right',
    });

    return (
        <div className={classnames(s['token-select'], className)}>
            <div className={s['token-select__info']}>
                <span>{selectedToken.tokenName}</span>
                {showPrice && (
                    <span className={priceClassName}>
                        <span className={s.priceSymbol}>{selectedToken.priceSymbol}</span>
                        <span className={s.priceChangeWrapper}>
                            <span>{selectedToken.price.toFixed(3)}</span>
                            {newPrice && (
                                <>
                                    <span>➔</span>
                                    <span>{newPrice.toFixed(3)}</span>
                                </>
                            )}
                        </span>
                    </span>
                )}
                {!showPrice && <span />}
            </div>
            <div className={s['token-select__inputs']}>
                <div className={s['token-select__inputs-info']}>
                    <Token
                        tokenName={selectedToken.tokenName}
                        tokenImage={selectedToken.tokenImage}
                        colorVar={selectedToken.colorVar}
                        className={s['token-select__token-icon']}
                    />

                    {tokens.length === 1 && (
                        <span className={s['token-select__token-name']}>{selectedToken.tokenSymbol}</span>
                    )}

                    {tokens.length > 1 && (
                        <NonLinkButton type="button" onClick={handleChangePairClick} className={s.changePairButton}>
                            {isDropdownOpen ? trans('global.action.cancel') : trans('market.action.changeTradingPair')}
                        </NonLinkButton>
                    )}
                </div>
                <input
                    type="number"
                    value={value}
                    placeholder={placeholder}
                    disabled={disabledInput}
                    className={s['token-select__input']}
                    onChange={(e) => onValueChange(e.target.value)}
                />
            </div>
            {tokens.length > 1 && isDropdownOpen && (
                <TokenDropdown onTokenClick={handleTokenClick} tokens={tokens} />
            )}
        </div>
    );
}
