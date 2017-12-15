import {createStore, applyMiddleware} from 'redux'
import rootReducer from '../reducers/rootReducer'
import {createLogger} from 'redux-logger'
import thunk from 'redux-thunk'


export default function configureStore(initialState) {
    const logger = createLogger();
    const store = createStore(
        rootReducer,
        initialState,
        applyMiddleware(thunk, logger));

    if (module.hot) {
        module.hot.accept('../reducers/rootReducer', () => {
            const nextRootReducer = require('../reducers/rootReducer').default;
            store.replaceReducer(nextRootReducer)
        })
    }
    return store
}
