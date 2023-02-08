import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import RoutedTabs from './RoutedTabs';

let wrapper;

const tabs = [
  { name: 'Details', link: '/organizations/19/details', id: 1 },
  { name: 'Access', link: '/organizations/19/access', id: 2 },
  { name: 'Teams', link: '/organizations/19/teams', id: 3 },
  { name: 'Notification', link: '/organizations/19/notification', id: 4 },
];

describe('<RoutedTabs />', () => {
  beforeEach(() => {
    wrapper = mount(
      <MemoryRouter initialEntries={['/organizations/19/teams']}>
        <RoutedTabs tabsArray={tabs} />
      </MemoryRouter>
    );
  });

  test('RoutedTabs renders successfully', () => {
    expect(wrapper.find('Tabs li')).toHaveLength(4);
  });

  test('Given a URL the correct tab is active', async () => {
    //expect(history.location.pathname).toEqual('/organizations/19/teams');
    expect(wrapper.find('Tabs').prop('activeKey')).toBe(3);
  });

  test('should update history when new tab selected', async () => {
    wrapper.find('Tabs').invoke('onSelect')({}, 2);
    wrapper.update();
    //expect(history.location.pathname).toEqual('/organizations/19/access');
    expect(wrapper.find('Tabs').prop('activeKey')).toBe(2);
  });
});
