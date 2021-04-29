import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { init } from './store';
import App from './App';
import getBaseName from './Utilities/getBaseName';

const MyApp = () => (
    // this is just an example here goes everything that was in `entry.js`
    <Provider store={init().getStore()}>
        <Router basename={getBaseName(location.pathname)}>
            <App />
        </Router>
    </Provider>
);

export default MyApp;
