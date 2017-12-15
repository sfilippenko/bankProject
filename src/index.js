import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux'
import { Router, Route, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import configureStore from './store/configureStore';
import DebtorRegistration from './containers/forms/DebtorRegistration';
import Drawing from './containers/forms/Drawing';
import Page404 from './containers/forms/Page404';

import './styles/bootstrap.min.css';
import './styles/app.scss';
import './styles/controls.scss';
import './styles/drawing.scss';

const store = configureStore();

const history = syncHistoryWithStore(hashHistory, store);

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <Route path='/' component={DebtorRegistration}/>
            <Route path='/drawing' component={Drawing}/>
            <Route path='/*' component={Page404}/>
        </Router>
    </Provider>,
    document.getElementById('root')
);

