import './bootstrap.min.css'

import 'babel-polyfill'

import thunkMiddleware from 'redux-thunk'
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { BrowserRouter } from 'react-router-dom'
import iKrelln from './reducers'
import { fetchTestResults } from './actions/testDetails';
import { fetchTestSuites } from './actions/testSuites';

let store = createStore(iKrelln, applyMiddleware(
    thunkMiddleware)
)

store
    .dispatch(fetchTestResults())

store
    .dispatch(fetchTestSuites())

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <App store={store}/>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);
registerServiceWorker();
