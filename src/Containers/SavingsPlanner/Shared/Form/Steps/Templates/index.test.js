import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderPage } from '../../../../../../Utilities/tests/helpers.reactTestingLib';
import Templates from '.';

import mockResponses from '../../../../../../Utilities/__fixtures__';
import * as api from '../../../../../../Api';
jest.mock('../../../../../../Api');

const mockDispatch = jest.fn();

const defaultProps = {
  template_id: -2,
  dispatch: mockDispatch,
};

describe('SavingsPlanner/Shared/Form/Templates', () => {
  beforeEach(() => {
    api.preflightRequest.mockResolvedValue(mockResponses.preflightRequest200);
    api.readJobExplorer.mockResolvedValue(
      mockResponses.readTemplateJobExplorer
    );
    api.readJobExplorerOptions.mockResolvedValue(mockResponses.readJobExplorer);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('has rendered preflight/authorization error component', async () => {
    api.preflightRequest.mockRejectedValue(mockResponses.preflightRequest401);
    renderPage(Templates, undefined, defaultProps);

    await waitFor(() => expect(api.preflightRequest).toHaveBeenCalledTimes(1));

    expect(screen.getByText('Not authorized')).toBeTruthy();
  });

  test('has rendered Empty page component', async () => {
    api.preflightRequest.mockRejectedValue(mockResponses.preflightRequest404);
    renderPage(Templates, undefined, defaultProps);

    await waitFor(() => expect(api.preflightRequest).toHaveBeenCalledTimes(1));

    expect(
      screen.getByText('Something went wrong, please try reloading the page')
    ).toBeTruthy();
  });

  test('has rendered RBAC Access error component', async () => {
    api.preflightRequest.mockRejectedValue(mockResponses.preflightRequest403);
    renderPage(Templates, undefined, defaultProps);

    await waitFor(() => expect(api.preflightRequest).toHaveBeenCalledTimes(1));

    expect(screen.getByText('RBAC Access Denied')).toBeTruthy();
  });

  test('has rendered NoResults page component', async () => {
    api.readJobExplorer.mockResolvedValue({
      items: [],
      meta: { count: 0 },
      isSuccess: true,
      response: { msg: 'Success', status: 200 },
      url: '/api/tower-analytics/v1/job_explorer/',
    });
    renderPage(Templates, undefined, defaultProps);

    await waitFor(() => expect(api.readJobExplorer).toHaveBeenCalledTimes(1));

    expect(screen.getByText('No results found')).toBeTruthy();
  });

  test('has rendered Templates component with data and is clickable', async () => {
    renderPage(Templates, undefined, defaultProps);

    await waitFor(() => expect(api.readJobExplorer).toHaveBeenCalledTimes(1));

    expect(screen.getByText('Link a template to this plan:')).toBeTruthy();

    expect(screen.getByText('test_template_name_0')).toBeTruthy();
    expect(screen.getByText('test_template_name_2')).toBeTruthy();

    fireEvent.click(screen.getByTestId('radio-345').querySelector('input'));
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_TEMPLATE_ID',
      value: 345,
    });

    fireEvent.click(screen.getByTestId('radio-1').querySelector('input'));
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_TEMPLATE_ID',
      value: 1,
    });
  });
});
