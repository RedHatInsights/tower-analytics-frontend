import '@testing-library/jest-dom';
import Add from '.';
import { act } from 'react-dom/test-utils';
import { screen } from '@testing-library/react';
import { renderPage } from '../../../Utilities/tests/helpers.reactTestingLib';
import mockResponses from '../../../Utilities/__fixtures__/';
import * as api from '../../../Api';
jest.mock('../../../Api');

describe('SavingsPlanner/Add', () => {
  beforeEach(() => {
    api.preflightRequest.mockResolvedValue(mockResponses.preflightRequest200);
    api.readPlanOptions.mockResolvedValue(mockResponses.readPlansOptions);
  });

  it('can see the Add component', async () => {
    await act(async () => {
      renderPage(Add);
    });

    expect(screen.getByText('Savings Planner')).toBeTruthy();
    expect(screen.getByText('Create new plan')).toBeTruthy();

    expect(screen.getAllByText('Details')).toHaveLength(2);
    expect(screen.getByText('Tasks')).toBeTruthy();
    expect(screen.getByText('Link template')).toBeTruthy();
  });

  it('redirects upon failure', async () => {
    api.preflightRequest.mockRejectedValue(mockResponses.preflightRequest403);
    api.readPlanOptions.mockResolvedValue({
      data: { meta: { rbac: { perms: { all: false } } } },
      isSuccess: true,
    });
    var wrapper;

    await act(async () => {
      wrapper = renderPage(Add);
    });

    expect(wrapper.container).toBeEmptyDOMElement();
  });
});
