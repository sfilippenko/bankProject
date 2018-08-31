import {createStore, applyMiddleware, compose} from 'redux'
import rootReducer from './reducers/rootReducer'
import {createLogger} from 'redux-logger'
import thunk from 'redux-thunk'

const middleWare = [thunk, createLogger()];
const args = [applyMiddleware(...middleWare)];
if (window.__REDUX_DEVTOOLS_EXTENSION__) {
    args.push(window.__REDUX_DEVTOOLS_EXTENSION__());
}
const store = createStore(
    rootReducer,
    compose(...args)
);

export default store;
