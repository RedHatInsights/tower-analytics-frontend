import { act } from 'react-dom/test-utils';
import { screen, waitFor } from '@testing-library/react';
import { renderPage } from '../../../__tests__/helpers.reactTestingLib';
import List from './List';

import mockResponses from '../../../__tests__/fixtures/';
import * as api from '../../../Api/';
jest.mock('../../../Api');

describe.skip('SavingsPlanner/List', () => {
  beforeEach(() => {
    api.preflightRequest.mockResolvedValue(mockResponses.preflightRequest200);
    api.readPlanOptions.mockResolvedValue(mockResponses.readPlansOptions);
    api.readPlans.mockResolvedValue(mockResponses.readPlans);
  });

  it('user can see a empty list message with add plan button', async () => {
    api.readPlans.mockResolvedValue({ items: [] });
    await act(async () => {
      renderPage(List);
    });
    await waitFor(() => screen.getAllByText(/Add plan/i));
    expect(screen.getByText('No plans found')).toBeTruthy;
    expect(screen.getAllByText(/Savings Planner/i));
  });

  it('user can see a list of plans', async () => {
    await act(async () => {
      renderPage(List);
    });
    expect(screen.getAllByText(/Savings Planner/i));
    const planName = mockResponses.readPlans.items[0].name;
    expect(screen.getByText(planName));
  });
});
