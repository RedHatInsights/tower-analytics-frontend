import { render, screen, waitFor } from '@testing-library/react';

// This should be cleaned up later or normalized
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

const data = {
  name: 'Name',
  projections: {
    time_stats: {
      cumulative_time_net_benefits: {
        initial: 1,
        year1: 2,
        year2: 3,
        year3: 4,
      },
      total_hours_saved: { initial: 1, year1: 2, year2: 3, year3: 4 },
      total_hours_spent_risk_adjusted: {
        initial: 1,
        year1: 2,
        year2: 3,
        year3: 4,
      },
    },
    monetary_stats: {
      cumulative_net_benefits: {
        initial: 1,
        year1: 2,
        year2: 3,
        year3: 4,
      },
      total_benefits: { initial: 1, year1: 2, year2: 3, year3: 4 },
      total_costs: { initial: 1, year1: 2, year2: 3, year3: 4 },
    },
  },
};

describe('<Clusters />', () => {
  it('should render successfully', async () => {
    render(<StatisticsTab tabsArray={tabs} data={data} />);
    await waitFor(() => screen.getByText('Costs'));
    expect(screen.getByText('Name')).toBeTruthy();
  });
});
