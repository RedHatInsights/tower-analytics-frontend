import { act } from 'react-dom/test-utils';
import { stringify } from 'query-string';
import {
  mountPage,
  preflight200,
  preflight400,
  preflight403,
} from '../../__tests__/helpers';
import fetchMock from 'fetch-mock-jest';
import JobExplorer from './JobExplorer';
import { jobExplorer } from '../../Utilities/constants';

fetchMock.config.overwriteRoutes = true;

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: jest.fn(),
    location: jest.fn(),
    pathname: 'some_path',
  }),
  useLocation: () => ({
    push: jest.fn(),
    pathname: 'some_path',
    search: '',
  }),
}));

const jobExplorerUrl = 'path:/api/tower-analytics/v1/job_explorer/';
const dummyData = (size, count = 0) => ({
  items: [...Array(size).keys()].map((i) => ({
    cluster_name: 'tower37',
    created: '2020-11-16T10:15:03.071284',
    elapsed: 1.153,
    finished: '2020-11-16T10:15:08.376634',
    id: {
      id: 339 + i,
      cluster_id: 694168 + i,
      cluster_url_base: 'https://tower37',
      template_id: 27775 + i,
      template_name: '02800550',
      tower_link: 'https://tower37/#/jobs/playbook/339',
    },
    job_type: 'job',
    most_failed_tasks: null,
    org_name: 'Ansible',
    started: '2020-11-16T10:15:07.223669',
    status: 'successful',
  })),
  meta: { count: count === 0 ? size : count },
});

const jobExplorerOptionsUrl =
  'path:/api/tower-analytics/v1/job_explorer_options/';
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

const defaultQueryParams = {
  ...jobExplorer.defaultParams,
  attributes: jobExplorer.attributes,
};

const getPagination = (wrapper) => wrapper.find('.pf-c-options-menu');

const getPaginationNav = (wrapper) => wrapper.find('.pf-c-pagination__nav');

const inspectCall = (url, method) => fetchMock.lastCall(url, method);

describe('Containers/JobExplorer', () => {
  let wrapper;

  beforeEach(() => {
    fetchMock.get({ ...preflight200 });
    fetchMock.post({ url: jobExplorerUrl }, { ...dummyData(5) });
    fetchMock.post({ url: jobExplorerOptionsUrl }, { ...jobExplorerOptions });
  });

  afterEach(() => {
    fetchMock.restore();
    wrapper = null;
  });

  it('should render without any errors', async () => {
    await act(async () => {
      wrapper = mountPage(JobExplorer, { history: jest.fn() });
    });
    wrapper.update();

    expect(wrapper).toBeTruthy();
  });

  it('should render preflight error', async () => {
    fetchMock.get({ ...preflight400 });
    await act(async () => {
      wrapper = mountPage(JobExplorer);
    });
    wrapper.update();

    expect(wrapper.text()).toEqual(expect.stringContaining('Not authorized'));
  });

  it('should render RBAC Access error', async () => {
    fetchMock.get({ ...preflight403 });
    await act(async () => {
      wrapper = mountPage(JobExplorer);
    });
    wrapper.update();

    expect(wrapper.text()).toEqual(
      expect.stringContaining('RBAC Access Denied')
    );
  });

  it('should render api error', async () => {
    fetchMock.post({
      url: jobExplorerOptionsUrl,
      response: { throws: { error: 'General Error' }, status: 400 },
    });

    await act(async () => {
      wrapper = mountPage(JobExplorer);
    });
    wrapper.update();

    expect(wrapper.text()).toEqual(expect.stringContaining('General Error'));
  });

  it('should render with empty response', async () => {
    fetchMock.post({ url: jobExplorerUrl }, { items: [] });

    await act(async () => {
      wrapper = mountPage(JobExplorer);
    });
    wrapper.update();

    expect(wrapper.text()).toEqual(expect.stringContaining('No results found'));
  });

  it('should send the default queryParams', async () => {
    await act(async () => {
      wrapper = mountPage(JobExplorer);
    });
    wrapper.update();
    const [, { body }] = inspectCall(jobExplorerUrl, 'POST');
    expect(JSON.parse(body)).toEqual(defaultQueryParams);
  });

  xit('should send the custom query params', async () => {
    const queryParams = {
      ...defaultQueryParams,
      template_id: [1, 2],
    };

    const search = stringify(
      {
        template_id: ['1', '2'],
      },
      { arrayFormat: 'bracket' }
    );

    await act(async () => {
      wrapper = mountPage(JobExplorer, { search });
    });
    wrapper.update();
    const [, { body }] = inspectCall(jobExplorerUrl, 'POST');
    expect(JSON.parse(body)).toEqual(queryParams);
  });

  it('should render the right amount of data rows', async () => {
    fetchMock.post({ url: jobExplorerUrl }, { ...dummyData(5) });
    await act(async () => {
      wrapper = mountPage(JobExplorer);
    });
    wrapper.update();

    // The fetchMock returns 5 data + the header row
    // Does not include expandable rows
    expect(wrapper.find('tr:not(.pf-c-table__expandable-row)')).toHaveLength(6);
  });

  it('should display the correct page number', async () => {
    fetchMock.post({ url: jobExplorerUrl }, { ...dummyData(5, 100) });

    await act(async () => {
      wrapper = mountPage(JobExplorer);
    });
    wrapper.update();

    // Be sure there are two paginations on the page
    expect(getPagination(wrapper)).toHaveLength(2);

    expect(getPagination(wrapper).at(0).text()).toEqual(
      expect.stringContaining('1 - 5 of 100')
    );
  });

  it('should change limit of displayed items (top)', async () => {
    await act(async () => {
      wrapper = mountPage(JobExplorer);
    });
    wrapper.update();

    // Bring up the select box
    act(() => {
      getPagination(wrapper).find('button').at(0).simulate('click');
    });
    wrapper.update();

    // Select the 15 items per page option.
    await act(async () => {
      getPagination(wrapper).find('ul').find('button').at(2).simulate('click');
    });
    wrapper.update();

    const [, { body }] = inspectCall(jobExplorerUrl, 'POST');

    expect(JSON.parse(body)).toEqual({
      ...defaultQueryParams,
      limit: 15,
      offset: 0,
    });
  });

  it('should change limit of displayed items (bottom)', async () => {
    await act(async () => {
      wrapper = mountPage(JobExplorer);
    });
    wrapper.update();

    // Bring up the select box
    act(() => {
      getPagination(wrapper).find('button').at(1).simulate('click');
    });
    wrapper.update();

    // Select the 20 items per page option.
    await act(async () => {
      getPagination(wrapper).find('ul').find('button').at(3).simulate('click');
    });
    wrapper.update();

    const [, { body }] = inspectCall(jobExplorerUrl, 'POST');

    expect(JSON.parse(body)).toEqual({
      ...defaultQueryParams,
      limit: 20,
      offset: 0,
    });
  });

  it('should send offset to API when jumping to next page', async () => {
    fetchMock.post({ url: jobExplorerUrl }, { ...dummyData(5, 100) });

    await act(async () => {
      wrapper = mountPage(JobExplorer);
    });
    wrapper.update();

    // Click on the next page button
    await act(async () => {
      // Upper navigation click
      getPaginationNav(wrapper).at(0).find('button').at(1).simulate('click');
    });
    wrapper.update();

    expect(getPagination(wrapper).at(0).text()).toEqual(
      expect.stringContaining('6 - 10 of 100')
    );

    const [, { body }] = inspectCall(jobExplorerUrl, 'POST');

    expect(JSON.parse(body)).toEqual({
      ...defaultQueryParams,
      offset: 5,
    });
  });

  it('should send offset to API when jumping to last the page', async () => {
    fetchMock.post({ url: jobExplorerUrl }, { ...dummyData(5, 100) });

    await act(async () => {
      wrapper = mountPage(JobExplorer);
    });
    wrapper.update();

    // Click on the next page button
    await act(async () => {
      // Bottom navigation click last page
      getPaginationNav(wrapper).at(1).find('button').at(3).simulate('click');
    });
    wrapper.update();

    expect(getPagination(wrapper).at(0).text()).toEqual(
      expect.stringContaining('96 - 100 of 100')
    );

    const [, { body }] = inspectCall(jobExplorerUrl, 'POST');

    expect(JSON.parse(body)).toEqual({
      ...defaultQueryParams,
      offset: 95,
    });
  });
});
