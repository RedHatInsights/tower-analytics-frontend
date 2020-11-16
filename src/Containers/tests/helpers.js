import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

// Initialize the mocked store (we don't use it but it is initialized)
const mockStore = configureStore();
const store = mockStore({});

export const history = {
    push: jest.fn()
};

export const search = '';

export const mountPage = Component => mount(
    <Provider store={ store } >
        <Component history={ history } location={ { search } }/>
    </Provider>
);

export const preflight200 = {
    url: '/api/tower-analytics/v0/authorized/',
    response: { msg: 'Authorized' }
};

export const preflight400 = {
    url: '/api/tower-analytics/v0/authorized/',
    response: { throws: { status: 401 }, status: 401 }
};
