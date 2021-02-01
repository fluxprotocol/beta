import React, { ReactElement, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import NotLoggedIn from '../../containers/NotLoggedIn';
import { signIn } from '../../redux/account/accountActions';


export default function NotLoggedInConnector(): ReactElement {
    const dispatch = useDispatch();

    const handleLoginClick = useCallback(() => {
        dispatch(signIn());
    }, [dispatch]);

    return (
        <NotLoggedIn onLoginClick={handleLoginClick} />
    );
}
