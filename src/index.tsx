import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import { StylesProvider } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

import App from './App';
import configureStore from './redux/store';

import './styles/global.module.scss';

const store = configureStore({});
ReactDOM.render(
    <Provider store={store}>
        <HashRouter basename="/beta" hashType="hashbang">
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <StylesProvider injectFirst>
                    <App />
                </StylesProvider>
            </MuiPickersUtilsProvider>
        </HashRouter>
    </Provider>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals(console.log);
