import 'babel-polyfill'
import 'bootstrap/dist/css/bootstrap.css';
import './react-datetime.css';

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
import { fetchResultComponent } from './actions/custom';

let store = createStore(iKrelln, applyMiddleware(
    thunkMiddleware)
)

store.dispatch(fetchResultComponent());

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);
registerServiceWorker();
