import { act } from 'react-dom/test-utils';
import { screen, waitFor } from '@testing-library/react';
import { renderPage } from '../../Utilities/tests/helpers.reactTestingLib';
import SavingsPlanner from './SavingsPlanner';

import mockResponses from '../../Utilities/__fixtures__/';
import * as api from '../../Api';
jest.mock('../../Api');

describe('<SavingsPlanner />', () => {
  afterEach(() => {
    api.preflightRequest.mockResolvedValue(mockResponses.preflightRequest200);
    api.readPlanOptions.mockResolvedValue(mockResponses.readPlansOptions);
    api.readPlans.mockResolvedValue(mockResponses.readPlans);
  });

  it('has rendered preflight/authorization error component', async () => {
    api.preflightRequest.mockRejectedValue(mockResponses.preflightRequest401);
    renderPage(SavingsPlanner);
    await waitFor(() => screen.getAllByText(/Savings Planner/i));
    expect(screen.getByText('Not authorized'));
  });

  it('has rendered Empty page component', async () => {
    api.preflightRequest.mockRejectedValue(mockResponses.preflightRequest404);
    await act(async () => {
      renderPage(SavingsPlanner);
    });
    expect(screen.getAllByText(/Savings Planner/i));
    expect(
      screen.getByText('Something went wrong, please try reloading the page')
    );
  });

  it('has rendered RBAC Access error component', async () => {
    api.preflightRequest.mockRejectedValue(mockResponses.preflightRequest403);
    await act(async () => {
      renderPage(SavingsPlanner);
    });
    expect(screen.queryByText(/Savings Planner/i)).toBeNull();
    expect(screen.getByText('RBAC Access Denied'));
  });

  it('user can see a empty list message with add plan button', async () => {
    api.readPlans.mockResolvedValue({ items: [] });
    await act(async () => {
      renderPage(SavingsPlanner);
    });
    await waitFor(() => screen.getAllByText(/Add plan/i));
    expect(screen.getByText('No plans added')).toBeTruthy;
    expect(screen.getAllByText(/Savings Planner/i));
  });

  it('user can see a list of plans', async () => {
    await act(async () => {
      renderPage(SavingsPlanner);
    });
    expect(screen.getAllByText(/Savings Planner/i));
    const planName = mockResponses.readPlans.items[0].name;
    expect(screen.getByText(planName));
  });
});
