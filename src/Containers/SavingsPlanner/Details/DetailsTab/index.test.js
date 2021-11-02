import { act } from 'react-dom/test-utils';
import reactRouterDom from 'react-router-dom';
const pushMock = jest.fn();
reactRouterDom.useHistory = jest.fn().mockReturnValue({ push: pushMock });

import DetailsTab from '.';

jest.mock('react-router-dom', () => ({
  useLocation: jest.fn().mockReturnValue({
    pathname: '/another-route',
    search: '',
    hash: '',
    state: null,
    key: '5nvxpbdafa',
  }),
}));

jest.mock('../../../../Components/Breadcrumbs', () => {
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
        link: '/savings-planner/1/statistics',
      },
    ],
  };
});

const tabs = [
  { name: 'Details', link: '/savings-planner/1/details', id: 1 },
  { name: 'Graph', link: '/savings-planner/19/statistics', id: 2 },
];

const dummyData = {
  id: 1,
  automation_status: { status: 'successful' },
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
};

it('should render successfully', async () => {
  let wrapper;
  await act(async () => {
    wrapper = mount(
      <DetailsTab tabsArray={tabs} plan={dummyData} canWrite={true} />
    );
  });
  wrapper.update();
  expect(wrapper.find('div.pf-c-description-list__text')).toHaveLength(9);
});
