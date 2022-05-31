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
    series_stats: [
      {
        year: 'initial',
        cumulative_time_net_benefits: 1,
        total_hours_saved: 1,
        total_hours_spent_risk_adjusted: 1,
        cumulative_net_benefits: 1,
        total_benefits: 1,
        total_costs: 1,
        id: 1,
      },
      {
        year: 'year1',
        cumulative_time_net_benefits: 2,
        total_hours_saved: 2,
        total_hours_spent_risk_adjusted: 2,
        cumulative_net_benefits: 2,
        total_benefits: 2,
        total_costs: 2,
        id: 2,
      },
      {
        year: 'year2',
        cumulative_time_net_benefits: 3,
        total_hours_saved: 3,
        total_hours_spent_risk_adjusted: 3,
        cumulative_net_benefits: 3,
        total_benefits: 3,
        total_costs: 3,
        id: 3,
      },
      {
        year: 'year3',
        cumulative_time_net_benefits: 4,
        total_hours_saved: 4,
        total_hours_spent_risk_adjusted: 4,
        cumulative_net_benefits: 4,
        total_benefits: 4,
        total_costs: 4,
        id: 4,
      },
    ],
  },
};

describe('SavingsPlanner/Details/StatisticsTab', () => {
  it('should render successfully', async () => {
    render(
      <MemoryRouter>
        <StatisticsTab tabsArray={tabs} plan={data} />
      </MemoryRouter>
    );
    await waitFor(() => screen.getByText('Money'));
    expect(screen.getByText('Name')).toBeTruthy();
  });
});
