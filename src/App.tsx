import React, { ReactElement } from 'react';

import { Route, Switch } from 'react-router';

import { routes } from './routes';
import { themeContext, useDarkMode } from './utils/hooks/useDarkModeTheme';

function App(): ReactElement {
    const [theme, toggleTheme] = useDarkMode();

    return (
        // @ts-ignore
        <themeContext.Provider value={{ toggleTheme, theme }}>
            <Switch>
                {routes.map((route): ReactElement => <Route {...route} key={route.key} />)}
            </Switch>
        </themeContext.Provider>
    );
};

export default App;
