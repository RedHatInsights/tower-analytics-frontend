import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { QueryParamsProvider } from '../QueryParams';
import store from '../store';

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
