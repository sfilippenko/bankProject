import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux'
import {Router, Route, hashHistory} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';
import Drawing from './pages/Drawing';
import Page404 from './pages/Page404';
import store from './store';
import './styles/bootstrap.min.css';
import './styles/app.scss';
import './styles/drawing.scss';

const history = syncHistoryWithStore(hashHistory, store);

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <Route path='/' component={Drawing}/>
            <Route path='/*' component={Page404}/>
        </Router>
    </Provider>,
    document.getElementById('root')
);

