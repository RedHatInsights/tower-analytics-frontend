import '@testing-library/jest-dom';
import Add from '.';
import { screen, waitFor } from '@testing-library/react';
import { renderPage } from '../../../__tests__/helpers.reactTestingLib';
import mockResponses from '../../../__tests__/fixtures/';
import * as api from '../../../Api';
jest.mock('../../../Api');

describe('SavingsPlanner/Add', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('can see the Add component', async () => {
    api.preflightRequest.mockResolvedValue(mockResponses.preflightRequest200);
    api.readPlanOptions.mockResolvedValue(mockResponses.readPlansOptions);
    let wrapper = renderPage(Add);

    await waitFor(() => {
      return expect(api.readPlanOptions).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText('Savings Planner')).toBeTruthy();
    expect(screen.getByText('Create new plan')).toBeTruthy();

    expect(screen.getAllByText('Details')).toHaveLength(2);
    expect(screen.getByText('Tasks')).toBeTruthy();
    expect(screen.getByText('Link template')).toBeTruthy();
    wrapper.unmount();
  });

  test('redirects upon 403', async () => {
    api.preflightRequest.mockRejectedValue(mockResponses.preflightRequest403);
    api.readPlanOptions.mockResolvedValue(
      mockResponses.readPlansOptionsRBACFalse
    );
    let wrapper = renderPage(Add);

    await waitFor(() => {
      return expect(api.readPlanOptions).toHaveBeenCalledTimes(1);
    });

    expect(wrapper.container).toBeEmptyDOMElement();
    wrapper.unmount();
  });
});
