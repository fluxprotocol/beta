import React, { ReactNode } from 'react';
import classnames from 'classnames';
import Button from '@material-ui/core/Button';

import s from './TextButton.module.scss';

interface Props {
    children: ReactNode;
    className?: string;
    onClick: () => void;
}

export default function TextButton({
    children,
    className = '',
    ...props
}: Props) {
    return (
        <Button {...props} className={classnames(s.root, className)}>{children}</Button>
    );
}
