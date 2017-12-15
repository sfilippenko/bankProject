import { combineReducers } from 'redux'
import debtorRegistration from './debtorRegistration'
import drawing from './drawing'
import {  routerReducer } from 'react-router-redux'

const appReducer = combineReducers({
    debtorRegistration,
    drawing,
    routing: routerReducer
});

const rootReducer = (state, action) => {
    if (action.type === 'LOGOUT') {
        state = undefined;
    }

    return appReducer(state, action)
};

export default rootReducer;
