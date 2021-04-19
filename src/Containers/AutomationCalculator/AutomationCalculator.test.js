import { act } from 'react-dom/test-utils';
import {
    history,
    mountPage,
    preflight200,
    preflight400,
    preflight403
} from '../../Utilities/tests/helpers';
import fetchMock from 'fetch-mock-jest';
import AutomationCalculator from './AutomationCalculator';
import TotalSavings from './TotalSavings';
fetchMock.config.overwriteRoutes = true;

const jobExplorerUrl = 'path:/api/tower-analytics/v1/roi_templates/';
const dummyRoiData = {
    items: [
        {
            id: 1,
            name: 'a',
            successful_elapsed_total: 3600,
            host_cluster_count: 10,
            total_org_count: 2,
            successful_hosts_total: 10,
            total_cluster_count: 20
        },
        {
            id: 2,
            name: 'b',
            successful_elapsed_total: 3600,
            host_cluster_count: 10,
            total_org_count: 2,
            successful_hosts_total: 10,
            total_cluster_count: 20
        },
        {
            id: 3,
            name: 'c',
            successful_elapsed_total: 0,
            host_cluster_count: 10,
            total_org_count: 2,
            successful_hosts_total: 10,
            total_cluster_count: 20
        }
    ]
};
const defaultTotalSaving = '1,460.00';
const jobExplorerOptionsUrl =
  'path:/api/tower-analytics/v1/roi_templates_options/';
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

const inputManCost = wrapper => wrapper.find('input').at(0);
const inputAutCost = wrapper => wrapper.find('input').at(1);
const inputsRuntime = wrapper => wrapper.find('input').slice(2);

describe('Containers/AutomationCalculator', () => {
    let wrapper;

    beforeEach(() => {
        let d3Container = document.createElement('div');
        d3Container.setAttribute('id', 'd3-roi-chart-root');
        document.body.appendChild(d3Container);

        fetchMock.get({ ...preflight200 });
        fetchMock.post({ url: jobExplorerUrl }, { ...dummyRoiData });
        fetchMock.post({ url: jobExplorerOptionsUrl }, { ...jobExplorerOptions });
    });

    afterEach(() => {
        let d3Container = document.getElementById('d3-roi-chart-root');
        d3Container.remove();
        wrapper.unmount();
        fetchMock.restore();
    });

    it('should render without errors', async () => {
        await act(async () => {
            wrapper = mountPage(AutomationCalculator);
        });
        wrapper.update();

        expect(wrapper).toBeTruthy();
        // Has 3 links in the list --> 3 data points
        expect(wrapper.find('a')).toHaveLength(3);
    });

    it('should render preflight error', async () => {
        fetchMock.get({ ...preflight400 });
        await act(async () => {
            wrapper = mountPage(AutomationCalculator);
        });
        wrapper.update();

        expect(wrapper.text()).toEqual(expect.stringContaining('Not authorized'));
    });

    it('should render RBAC Access error', async () => {
        fetchMock.get({ ...preflight403 });
        await act(async () => {
            wrapper = mountPage(AutomationCalculator);
        });
        wrapper.update();

        expect(wrapper.text()).toEqual(expect.stringContaining('RBAC Access Denied'));
    });

    it('should render api error', async () => {
        fetchMock.post({
            url: jobExplorerUrl,
            response: { throws: { error: 'General Error' }, status: 400 }
        });

        await act(async () => {
            wrapper = mountPage(AutomationCalculator);
        });
        wrapper.update();

        expect(wrapper.text()).toEqual(expect.stringContaining('General Error'));
        // No data displayed
        expect(wrapper.find('a')).toHaveLength(0);
    });

    it('should render no data', async () => {
        fetchMock.post({ url: jobExplorerUrl }, { items: []});

        await act(async () => {
            wrapper = mountPage(AutomationCalculator);
        });
        wrapper.update();

        expect(wrapper.text()).toEqual(expect.stringContaining('No Data'));
        // No data displayed
        expect(wrapper.find('a')).toHaveLength(0);
    });

    it('should call redirect to job expoler', async () => {
        await act(async () => {
            wrapper = mountPage(AutomationCalculator);
        });
        wrapper.update();

        wrapper
        .find('a')
        .at(0)
        .simulate('click');
        expect(history.push).toHaveBeenCalledWith({
            pathname: '/job-explorer',
            search: expect.stringContaining('template_id[]=1')
        });
    });

    it('should compute total savings correctly', async () => {
        await act(async () => {
            wrapper = mountPage(AutomationCalculator);
        });
        wrapper.update();

        expect(wrapper.find(TotalSavings).text()).toEqual(
            expect.stringContaining(defaultTotalSaving)
        );
    });

    it('should recompute total savings correctly after changed manual costs', async () => {
        await act(async () => {
            wrapper = mountPage(AutomationCalculator);
        });
        wrapper.update();

        const c = inputManCost(wrapper);
        act(() => {
            c.instance().value = '100'; // more expensive
            c.simulate('change', { target: { value: '' }});
        });
        wrapper.update();

        expect(wrapper.find(TotalSavings).text()).toEqual(
            expect.stringContaining('2,960.00')
        );
    });

    it('should recompute total savings correctly after changed automated costs', async () => {
        await act(async () => {
            wrapper = mountPage(AutomationCalculator);
        });
        wrapper.update();

        const c = inputAutCost(wrapper);
        act(() => {
            c.instance().value = '10'; // cheaper
            c.simulate('change', { target: { value: '' }});
        });
        wrapper.update();

        expect(wrapper.find(TotalSavings).text()).toEqual(
            expect.stringContaining('1,480.00')
        );
    });

    it('should recompute total savings correctly after changed average runtime', async () => {
        await act(async () => {
            wrapper = mountPage(AutomationCalculator);
        });
        wrapper.update();

        const inputs = inputsRuntime(wrapper);
        act(() => {
            inputs.at(0).instance().value = '30';
            inputs.at(0).simulate('change', { target: { value: '' }});
        });
        wrapper.update();

        expect(wrapper.find(TotalSavings).text()).toEqual(
            expect.stringContaining('1,210.00')
        );
    });
});
