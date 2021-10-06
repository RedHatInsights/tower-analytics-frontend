import { act } from 'react-dom/test-utils';
import { parse } from 'query-string';
import { mountPage } from '../../__tests__/helpers';
import fetchMock from 'fetch-mock-jest';
import Notifications from './Notifications';

const notificationsUrl = 'path:/api/tower-analytics/v0/notifications/';
const notificationsDummyData = (size = 5, count = 0) => ({
  notifications: [...Array(size).keys()].map((i) => ({
    active: true,
    code: 'NOTIFICATIONS_LAST_UPDATED',
    date: '2020-11-24T11:38:21.735653',
    label: 'notice',
    message: 'Notifications last updated 2020-11-24T11:38:21+00:00',
    notification_id: i,
    tower_url: null,
  })),
  meta: { count: count === 0 ? size : count },
});

const clusterUrl = 'path:/api/tower-analytics/v0/clusters/';
const clusterDummyData = (size = 20) => ({
  templates: [...Array(size).keys()].map((i) => ({
    cluster_id: i,
    install_uuid: 'bb7abc1e-fc12-4d7b-a61a-19715539eea1',
    label: '10.10.14.195',
  })),
});

const lastCallBody = (url) => parse(fetchMock.lastCall(url)[0].split('?')[1]);

const getPagination = (wrapper) => wrapper.find('.pf-c-options-menu');

const getPaginationNav = (wrapper) => wrapper.find('.pf-c-pagination__nav');

describe('Containers/Notifications', () => {
  let wrapper;

  beforeEach(() => {
    fetchMock.get({ url: clusterUrl }, { ...clusterDummyData() });
    fetchMock.get({ url: notificationsUrl }, { ...notificationsDummyData() });
  });

  afterEach(() => {
    fetchMock.restore();
    wrapper = null;
  });

  it('should render without any errors', async () => {
    await act(async () => {
      wrapper = mountPage(Notifications);
    });
    wrapper.update();

    expect(wrapper).toBeTruthy();
  });

  it('should render with empty response', async () => {
    fetchMock.get(
      { url: notificationsUrl, overwriteRoutes: true },
      { notifications: [], meta: {} }
    );

    await act(async () => {
      wrapper = mountPage(Notifications);
    });
    wrapper.update();

    expect(wrapper.text()).toEqual(expect.stringContaining('No Data'));
  });

  it('should render the right amount of data rows', async () => {
    await act(async () => {
      wrapper = mountPage(Notifications);
    });
    wrapper.update();

    // The fetchMock returns 5 notifications
    expect(wrapper.find('.pf-c-notification-drawer__list-item')).toHaveLength(
      5
    );
  });

  it('should display the correct page number', async () => {
    fetchMock.get(
      {
        url: notificationsUrl,
        overwriteRoutes: true,
      },
      { ...notificationsDummyData(5, 100) }
    );

    await act(async () => {
      wrapper = mountPage(Notifications);
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
      wrapper = mountPage(Notifications);
    });
    wrapper.update();

    // Bring up the select box
    act(() => {
      getPagination(wrapper).find('button').at(0).simulate('click');
    });
    wrapper.update();

    // Select the 20 items per page option.
    await act(async () => {
      getPagination(wrapper).find('ul').find('button').at(2).simulate('click');
    });
    wrapper.update();

    expect(lastCallBody(notificationsUrl)).toEqual({
      limit: '15',
      offset: '0',
      sort_options: 'created',
    });
  });

  it('should change limit of displayed items (bottom)', async () => {
    await act(async () => {
      wrapper = mountPage(Notifications);
    });
    wrapper.update();

    // Bring up the select box
    act(() => {
      getPagination(wrapper).find('button').at(1).simulate('click');
    });
    wrapper.update();

    // Select the 50 items per page option.
    await act(async () => {
      getPagination(wrapper).find('ul').find('button').at(3).simulate('click');
    });
    wrapper.update();

    expect(lastCallBody(notificationsUrl)).toEqual({
      limit: '20',
      offset: '0',
      sort_options: 'created',
    });
  });

  it('should send offset to API when jumping to next page', async () => {
    fetchMock.get(
      {
        url: notificationsUrl,
        overwriteRoutes: true,
      },
      { ...notificationsDummyData(5, 100) }
    );

    await act(async () => {
      wrapper = mountPage(Notifications);
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
    expect(lastCallBody(notificationsUrl)).toEqual({
      limit: '5',
      offset: '5',
      sort_options: 'created',
    });
  });

  it('should send offset to API when jumping to last the page', async () => {
    fetchMock.get(
      {
        url: notificationsUrl,
        overwriteRoutes: true,
      },
      { ...notificationsDummyData(5, 100) }
    );

    await act(async () => {
      wrapper = mountPage(Notifications);
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
    expect(lastCallBody(notificationsUrl)).toEqual({
      limit: '5',
      offset: '95',
      sort_options: 'created',
    });
  });
});
