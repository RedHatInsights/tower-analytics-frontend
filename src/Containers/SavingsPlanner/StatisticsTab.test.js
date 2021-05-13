import reactRouterDom from 'react-router-dom';
const pushMock = jest.fn();
reactRouterDom.useHistory = jest.fn().mockReturnValue({ push: pushMock });

import StatisticsTab from './StatisticsTab';

jest.mock('react-router-dom', () => ({
  useLocation: jest.fn().mockReturnValue({
    pathname: '/another-route',
    search: '',
    hash: '',
    state: null,
    key: '5nvxpbdafa',
  }),
}));

jest.mock('../../Components/Breadcrumbs', () => {
  return {
    __esModule: true,
    default: async () => [
      {
        id: 1,
        name: 'Details',
        link: '/savings-planner/1/details',
      },
      {
        id: 2,
        name: 'Statistics',
        link: '/savings-planner/1/statistics',
      },
    ],
  };
});

const tabs = [
  { name: 'Details', link: '/savings-planner/1/details', id: 1 },
  { name: 'Statistics', link: '/savings-planner/19/statistics', id: 2 },
];

let wrapper;
it('should render successfully', () => {
  wrapper = mount(<StatisticsTab tabsArray={tabs} />);
  wrapper.update();
  expect(wrapper.find('div.pf-c-card__body')).toHaveLength(1);
});
