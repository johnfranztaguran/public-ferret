import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import createSagaMiddleware from 'redux-saga';
import reducers from './reducers';
import { createHistory } from './history';

const history = createHistory();
const sagaMiddleware = createSagaMiddleware();

const middlewares = [thunk, sagaMiddleware];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const createReducer = reducerSet => combineReducers({ ...reducers, ...reducerSet });
const store = createStore(createReducer(), composeEnhancers(applyMiddleware(...middlewares)));
store.async = {};

const registerReducer = (store, name, reducer) => {
    store.async[name] = reducer;
    store.replaceReducer(createReducer(store.async));
};

export { store, history, registerReducer };
