import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import StatisticsTab from '.';

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

describe('SavingsPlanner/Details/StatisticsTab', () => {
  it('should render successfully', async () => {
    render(
      <MemoryRouter>
        <StatisticsTab tabsArray={tabs} data={data} />
      </MemoryRouter>
    );
    await waitFor(() => screen.getByText('Money'));
    expect(screen.getByText('Name')).toBeTruthy();
  });
});
