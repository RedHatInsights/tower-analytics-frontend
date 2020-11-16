/* eslint-disable no-unused-vars, camelcase */
import { act } from 'react-dom/test-utils';
import {
    history,
    search,
    mountPage,
    preflight200,
    preflight400
} from '../tests/helpers';
import fetchMock from 'fetch-mock-jest';
import JobExplorer from './JobExplorer';
fetchMock.config.overwriteRoutes = true;

const jobExplorerUrl = 'path:/api/tower-analytics/v1/job_explorer/';
const dummyData = { items: [], meta: { count: 0 }};

const jobExplorerOptionsUrl = 'path:/api/tower-analytics/v1/job_explorer_options/';
const jobExplorerOptions = {
    quick_date_range: [
        { key: 'last_30_days', value: 'Last 30 days' },
        { key: 'last_2_weeks', value: 'Last 2 weeks' },
        { key: 'last_week', value: 'Last week' },
        { key: 'last_72_hours', value: 'Last 72 hours' },
        { key: 'last_24_hours', value: 'Last 24 hours' },
        { key: 'custom', value: 'Custom' }
    ]
};

describe('Containers/JobExplorer', () => {
    let wrapper;

    beforeEach(() => {
        fetchMock.get({ ...preflight200 });
        fetchMock.post({ url: jobExplorerUrl }, { ...dummyData });
        fetchMock.post({ url: jobExplorerOptionsUrl }, { ...jobExplorerOptions });
    });

    afterEach(() => {
        fetchMock.restore();
        wrapper = null;
    });

    it('should render without any errors', async () => {
        await act(async () => {
            wrapper = mountPage(JobExplorer);
        });
        wrapper.update();

        expect(wrapper).toBeTruthy();
    });
});
