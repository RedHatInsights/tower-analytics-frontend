import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { init } from './store';
import App from './App';
import getBaseName from './Utilities/getBaseName';

ReactDOM.render(
    <Provider store={init().getStore()}>
        <Router basename={getBaseName()}>
            <App />
        </Router>
    </Provider>,

    document.getElementById('root')
);
