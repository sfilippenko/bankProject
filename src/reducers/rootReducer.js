import { combineReducers } from 'redux';
import drawing from './drawing';
import {  routerReducer } from 'react-router-redux';

const rootReducer = combineReducers({
    drawing,
    routing: routerReducer
});

export default rootReducer;
