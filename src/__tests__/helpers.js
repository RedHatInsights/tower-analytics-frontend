import React from 'react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { createMemoryHistory } from 'history';
import { QueryParamsProvider } from '../QueryParams';

// Initialize the mocked store (we don't use it but it is initialized)
const mockStore = configureStore();
const store = mockStore({});

export const history = createMemoryHistory();

export const mountPage = (Component) =>
  mount(
    <Provider store={store}>
      <Router history={history}>
        <QueryParamsProvider>
          <Component />
        </QueryParamsProvider>
      </Router>
    </Provider>
  );

export const mockUseRequestDefaultParams = (_req, defaultValues) => ({
  result: defaultValues,
  error: null,
  isLoading: false,
  isSuccess: true,
  request: jest.fn(),
  setValue: jest.fn(),
});

export const preflight200 = {
  url: '/api/tower-analytics/v0/authorized/',
  response: { msg: 'Authorized' },
};

export const preflight400 = {
  url: '/api/tower-analytics/v0/authorized/',
  response: { throws: { status: 401 }, status: 401 },
};

export const preflight403 = {
  url: '/api/tower-analytics/v0/authorized/',
  response: { throws: { status: 403 }, status: 403 },
};
