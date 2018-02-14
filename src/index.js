import 'babel-polyfill'

import thunkMiddleware from 'redux-thunk'
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import iKrelln from './reducers'
import { fetchTestSuites } from './actions/testSuites';

let store = createStore(iKrelln, applyMiddleware(
    thunkMiddleware)
)

store
    .dispatch(fetchTestSuites())
    .then(() => console.log(store.getState()))

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
registerServiceWorker();
