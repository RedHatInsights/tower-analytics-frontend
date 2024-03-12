import { act } from 'react-dom/test-utils';
import {
  mountPage,
  mockUseRequestDefaultParams,
} from '../../__tests__/helpers';
import fetchMock from 'fetch-mock-jest';
import OrganizationStatistics from './OrganizationStatistics';
import { organizationStatistics } from '../../Utilities/constants';
import * as useRequest from '../../Utilities/useRequest';

const chartRoots = [
  'd3-grouped-bar-chart-root',
  'd3-donut-1-chart-root',
  'd3-donut-2-chart-root',
];

const jobExplorerUrl = 'path:/api/tower-analytics/v1/job_explorer/';
const dummyOrgData = (size) => ({
  meta: { count: size, legend: [] },
  dates: [...Array(size).keys()].map((el) => ({
    items: [...Array(size).keys()].map((i) => ({
      id: i - 1,
      total_count: i * el,
      name: i === 0 ? '' : 'org name',
    })),
    date: new Date(),
  })),
});

const dummyPieData = (size) => ({
  items: [...Array(size).keys()].map((i) => ({
    id: i - 1,
    host_count: i * 10,
    name: i === 0 ? '' : 'org name',
  })),
});

const hostExplorerUrl = 'path:/api/tower-analytics/v1/host_explorer/';
const dummyHostsData = (size) => ({
  meta: { count: size, legend: [] },
  dates: [...Array(size).keys()].map((el) => ({
    items: [...Array(size).keys()].map((i) => ({
      id: i - 1,
      total_count: i * el,
      name: i === 0 ? '' : 'org name',
      host_task_count: 8000,
      total_org_count: 1,
      total_unique_host_count: 100,
    })),
    date: new Date(),
  })),
});

const jobExplorerOptionsUrl =
  'path:/api/tower-analytics/v1/dashboard_organization_statistics_options/';
const jobExplorerOptions = {
  quick_date_range: [
    { key: 'last_30_days', value: 'Last 30 days' },
    { key: 'last_2_weeks', value: 'Last 2 weeks' },
    { key: 'last_week', value: 'Last week' },
    { key: 'last_72_hours', value: 'Last 72 hours' },
    { key: 'last_24_hours', value: 'Last 24 hours' },
    { key: 'custom', value: 'Custom' },
  ],
};

const defaultQueryParamsForPie = {
  ...organizationStatistics.defaultParams,
  attributes: ['total_count'],
  group_by: 'org',
  include_others: true,
  sort_options: 'total_count',
  sort_order: 'desc',
};

const defaultQueryParamsForBar = {
  ...organizationStatistics.defaultParams,
  attributes: ['total_count'],
  group_by: 'org',
  group_by_time: true,
  sort_options: 'total_count',
  sort_order: 'desc',
};

const defaultHostsQueryParams = {
  ...organizationStatistics.defaultParams,
  attributes: ['total_unique_host_count'],
  group_by: 'org',
  group_by_time: true,
  sort_options: 'host_task_count',
  sort_order: 'desc',
};

const lastCallBody = (url) => JSON.parse(fetchMock.lastCall(url)[1].body);

describe.skip('Containers/OrganizationStatistics', () => {
  let wrapper;

  beforeEach(() => {
    chartRoots.forEach((item) => {
      let d3Container = document.createElement('div');
      d3Container.setAttribute('id', item);
      document.body.appendChild(d3Container);
    });

    fetchMock.post(
      {
        url: jobExplorerUrl,
        body: { group_by: 'org', group_by_time: true },
        matchPartialBody: true,
      },
      { ...dummyOrgData(5) }
    );
    fetchMock.post(
      {
        url: jobExplorerUrl,
        body: { group_by: 'org', include_others: true },
        matchPartialBody: true,
        overwriteRoutes: false,
      },
      { ...dummyPieData(5) }
    );
    fetchMock.post({ url: jobExplorerOptionsUrl }, { ...jobExplorerOptions });
    fetchMock.post({ url: hostExplorerUrl }, { ...dummyHostsData(5) });
  });

  afterEach(() => {
    chartRoots.forEach((item) => {
      let d3Container = document.getElementById(item);
      d3Container.remove();
    });

    fetchMock.restore();
    wrapper.unmount();
  });

  xit('should render without any errors', async () => {
    fetchMock.post(
      { url: jobExplorerUrl, overwriteRoutes: true },
      { items: [] }
    );
    await act(async () => {
      wrapper = mountPage(OrganizationStatistics);
    });
    wrapper.update();

    expect(wrapper).toBeTruthy();
  });

  it('should render with data', async () => {
    fetchMock.post({ url: jobExplorerUrl, overwriteRoutes: true }, {});
    await act(async () => {
      wrapper = mountPage(OrganizationStatistics);
    });
    wrapper.update();

    expect(wrapper.text()).not.toEqual(expect.stringContaining('*No Data*'));
    expect(wrapper.text()).not.toEqual(expect.stringContaining('*Loading*'));
  });

  it('should render api error', async () => {
    fetchMock.post({
      url: jobExplorerUrl,
      overwriteRoutes: true,
      response: { throws: { error: 'General Error' }, status: 400 },
    });

    await act(async () => {
      wrapper = mountPage(OrganizationStatistics);
    });
    wrapper.update();
    expect(wrapper.text()).toEqual(expect.stringContaining('Error'));
  });

  it('should render with empty response', async () => {
    fetchMock.post(
      { url: jobExplorerUrl, overwriteRoutes: true },
      { items: [] }
    );

    await act(async () => {
      wrapper = mountPage(OrganizationStatistics);
    });
    wrapper.update();
    expect(wrapper.text()).toEqual(expect.stringContaining('No Data'));
  });

  it('should send the default queryParams', async () => {
    await act(async () => {
      wrapper = mountPage(OrganizationStatistics);
    });
    wrapper.update();

    expect(lastCallBody(jobExplorerUrl)).toEqual(defaultQueryParamsForPie);
  });

  it('should handle the tab switching correctly', async () => {
    await act(async () => {
      wrapper = mountPage(OrganizationStatistics);
    });

    wrapper.update();

    const tabs = wrapper.find('.pf-c-tabs__link');

    // Click on the hosts tab
    await act(async () => {
      tabs.at(2).simulate('click');
    });
    wrapper.update();

    // Wait for the call to hosts options and hosts data
    expect(lastCallBody(hostExplorerUrl)).toEqual(defaultHostsQueryParams);

    // Click on the orgs tab
    await act(async () => {
      tabs.at(1).simulate('click');
    });

    expect(lastCallBody(jobExplorerUrl)).toEqual(defaultQueryParamsForBar);
  });

  it('should render with default api values', async () => {
    const spy = jest.spyOn(useRequest, 'default');
    spy.mockImplementation(mockUseRequestDefaultParams);

    await act(async () => {
      wrapper = mountPage(OrganizationStatistics);
    });
    wrapper.update();

    expect(wrapper.text()).toEqual(expect.stringContaining('Job Runs'));
    expect(wrapper.text()).toEqual(expect.stringContaining('Usage by'));
    spy.mockRestore();
  });
});
