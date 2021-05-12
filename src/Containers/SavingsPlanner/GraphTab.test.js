import reactRouterDom from 'react-router-dom';
const pushMock = jest.fn();
reactRouterDom.useHistory = jest.fn().mockReturnValue({ push: pushMock });

import GraphTab from './GraphTab';

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
        name: 'Graph',
        link: '/savings-planner/1/graph',
      },
    ],
  };
});

const tabs = [
  { name: 'Details', link: '/savings-planner/1/details', id: 1 },
  { name: 'Graph', link: '/savings-planner/19/graph', id: 2 },
];

let wrapper;
it('should render successfully', () => {
  wrapper = mount(<GraphTab tabsArray={tabs} />);
  wrapper.update();
  expect(wrapper.find('div.pf-c-card__body')).toHaveLength(1);
});
