import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

<<<<<<< HEAD
describe('Containers/Clusters', () => {
  it('Clusters loads', () => {
    expect(Clusters).toBeTruthy();
  });
  it('should render successfully', () => {
    shallow(<Clusters />);
  });
=======
import Clusters from './Clusters';

const clustersUrl = 'path:/api/tower-analytics/v1/job_explorer/';
const dummyData = {
    url: clustersUrl,
    data: [{
        cluster_id: 1,
        install_uuid: 'bb7abc1e-fc12-4d7b-a61a-19715539eea1',
        label: '10.10.14.195'
    }],
    response: { msg: 'Success' }
};

describe('<Clusters />', () => {
    let mockStore;
    let store;

    beforeEach(() => {
        mockStore = configureStore();
        store = mockStore({ initialState: {}});
    });

    afterEach(() => {
        global.fetch.mockClear();
        delete global.fetch;
    });

    test('has rendered preflight/authorization error component', async () => {
        await act(async () => {
            global.fetch = jest.fn().mockImplementation(() =>
                Promise.resolve({
                    status: 401,
                    json: () => Promise.resolve(dummyData)
                })
            );
            render(<Provider store={store}><Clusters />)</Provider>);
        });
        expect(screen.getAllByText(/Clusters/i));
        expect(screen.getByText('Not authorized'));
    });

    test('has rendered Empty page component', async () => {
        await act(async () => {
            global.fetch = jest.fn().mockImplementation(() =>
                Promise.resolve({
                    json: () => Promise.resolve(dummyData)
                })
            );
            render(<Provider store={store}><Clusters />)</Provider>);
        });
        expect(screen.getAllByText(/Clusters/i));
        expect(screen.getByText('Something went wrong, please try reloading the page'));
    });

    test('has rendered RBAC Access error component', async () => {
        await act(async () => {
            global.fetch = jest.fn().mockImplementation(() =>
                Promise.resolve({
                    status: 403,
                    json: () => Promise.resolve(dummyData)
                })
            );
            render(<Provider store={store}><Clusters />)</Provider>);
        });
        expect(screen.queryByText(/Clusters/i)).toBeNull();
        expect(screen.getByText('RBAC Access Denied'));
    });

    test('has rendered Clusters component with data', async () => {
        await act(async () => {
            global.fetch = jest.fn().mockImplementation(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(dummyData)
                })
            );
            render(<Provider store={store}><Clusters />)</Provider>);
        });
        expect(screen.getAllByText(/Clusters/i));
        expect(screen.getByText('Jobs across all clusters'));
        expect(screen.getByText('Job status'));
    });
>>>>>>> Added react testing library for Clusters screen
});
