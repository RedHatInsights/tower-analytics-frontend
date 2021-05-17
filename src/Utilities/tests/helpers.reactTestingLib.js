import React from 'react';
import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom'

// Initialize the mocked store
// AAA don't use it but it is needed by the <Main> component
const mockStore = configureStore();
const store = mockStore({});

export const history = {
    push: jest.fn(),
    replace: jest.fn()
};

const defaultParams = {
    search: ''
};

export const renderPage = (Component, { search } = defaultParams) =>
    render(
        <Provider store={store}>
            <MemoryRouter>
                <Component location={{ search }} />
            </MemoryRouter>
        </Provider>
    );
