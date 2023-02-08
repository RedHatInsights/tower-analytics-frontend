import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryParamsProvider } from '../QueryParams';
import store from '../store';

const defaultParams = {
  search: '',
};

export const renderPage = (Component, { search } = defaultParams, props = {}) =>
  render(
    <Provider store={store}>
      <MemoryRouter>
        <QueryParamsProvider>
          <Routes>
            <Route
              path={'/'}
              element={<Component location={{ search }} {...props} />}
            />
            <Route path={'*'} element={<></>} />
          </Routes>
        </QueryParamsProvider>
      </MemoryRouter>
    </Provider>
  );
