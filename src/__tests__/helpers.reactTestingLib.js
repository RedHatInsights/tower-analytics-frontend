import React from 'react';
import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { QueryParamsProvider } from '../QueryParams';

// Initialize the mocked store
// AAA don't use it but it is needed by the <Main> component
const mockStore = configureStore();
const store = mockStore({});

export const history = {
  ...createMemoryHistory(),
};

const defaultParams = {
  search: '',
};

export const renderPage = (Component, { search } = defaultParams, props = {}) =>
  render(
    <Provider store={store}>
      <Router history={history}>
        <QueryParamsProvider>
          <Component location={{ search }} {...props} />
        </QueryParamsProvider>
      </Router>
    </Provider>
  );
