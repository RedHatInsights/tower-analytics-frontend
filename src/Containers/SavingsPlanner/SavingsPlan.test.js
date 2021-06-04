import React from 'react';
import { act } from 'react-dom/test-utils';
import { createMemoryHistory } from 'history';
import fetchMock from 'fetch-mock-jest';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import {
  mountWithContexts,
  waitForElement,
} from '../../Utilities/enzymeHelpers';

const mockStore = configureStore();
const store = mockStore({});

fetchMock.config.overwriteRoutes = true;
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useRouteMatch: () => ({
    url: '/savings-planner/1',
    params: { id: 1 },
  }),
}));
import SavingsPlan from './SavingsPlan';

const readPlanUrl = 'path:/api/tower-analytics/v1/plans/';
const dummyData = {
  url: readPlanUrl,
  response: {
    isLoading: false,
    isSuccess: true,
    error: null,
    items: [
      {
        id: 1,
        automation_status: 'successful',
        category: 'foo',
        description: 'foo bar',
        frequency_period: 'monthly',
        hosts: 20,
        manual_time: 60,
        modified: '2020-11-16T10:15:07.223669',
        name: 'Foo',
        tasks: [],
        template_details: { id: 1, name: 'template foo' },
        template_id: 1,
      },
    ],
  },
};

describe('<SavingsPlan />', () => {
  let wrapper;

  afterEach(() => {
    wrapper.unmount();
    jest.clearAllMocks();
  });

  it('should render Savings Plan page with Switch/Routes', async () => {
    fetchMock.post({ ...dummyData });
    const history = createMemoryHistory({
      initialEntries: ['/savings-planner/1'],
    });

    await act(async () => {
      wrapper = mountWithContexts(
        <Provider store={store}>
          <SavingsPlan />
        </Provider>,
        {
          context: {
            router: {
              history,
            },
          },
        }
      );
    });
    wrapper.update();
    await waitForElement(wrapper, 'ContentLoading', (el) => el.length === 0);
    expect(wrapper.find('SavingsPlan').length).toBe(1);
    expect(wrapper.find('Breadcrumbs')).toHaveLength(1);
    expect(wrapper.find('BreadcrumbItem')).toHaveLength(2);
    expect(wrapper.find('Switch')).toHaveLength(1);
    expect(wrapper.find('Router')).toHaveLength(1);
    expect(wrapper.find('Route')).toHaveLength(1);
    expect(wrapper.find('div.pf-c-description-list__text')).toHaveLength(9);
  });
});
