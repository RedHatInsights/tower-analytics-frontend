import React from 'react';
import { act } from 'react-dom/test-utils';
import fetchMock from 'fetch-mock-jest';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { waitForElement } from '../../../Utilities/enzymeHelpers';
import { MemoryRouter } from 'react-router-dom';
import { mount } from 'enzyme';

const mockStore = configureStore();
const store = mockStore({});

fetchMock.config.overwriteRoutes = true;
//import Details from './Details';

import mockResponses from '../../../__tests__/fixtures/';
import * as api from '../../../Api/';
jest.mock('../../../Api');

describe.skip('SavingsPlanner/Details', () => {
  let wrapper;

  afterEach(() => {
    wrapper.unmount();
    jest.clearAllMocks();
  });

  it('should render Savings Plan page with Switch/Routes', async () => {
    api.readPlan.mockResolvedValue(mockResponses.readPlan);

    await act(async () => {
      wrapper = mount(
        <MemoryRouter initialEntries={['/savings-planner/1']}>
          <Provider store={store}>
            <Details />
          </Provider>
        </MemoryRouter>
      );
    });
    wrapper.update();
    await waitForElement(wrapper, 'ContentLoading', (el) => el.length === 0);
    expect(wrapper.find('DetailsTab').length).toBe(1);
    expect(wrapper.find('Breadcrumbs')).toHaveLength(1);
    expect(wrapper.find('BreadcrumbItem')).toHaveLength(2);
    expect(wrapper.find('div.pf-c-description-list__text')).toHaveLength(7);
  });
});
