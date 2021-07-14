import { act } from 'react-dom/test-utils';
import { screen, fireEvent } from '@testing-library/react';
import { renderPageWithProps } from '../../../../../../Utilities/tests/helpers.reactTestingLib';
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
    api.readJobExplorer.mockResolvedValue({
      meta: {},
      items: [
        {
          id: 345,
          name: 'test_template_name_0',
        },
        {
          id: 1,
          name: 'test_template_name_2',
        },
      ],
    });
    api.readJobExplorerOptions.mockResolvedValue(mockResponses.readJobExplorer);
  });

  test('has rendered preflight/authorization error component', async () => {
    api.preflightRequest.mockRejectedValue(mockResponses.preflightRequest401);
    await act(async () => {
      renderPageWithProps(Templates, defaultProps);
    });
    expect(screen.getByText('Not authorized')).toBeTruthy();
  });

  test('has rendered Empty page component', async () => {
    api.preflightRequest.mockRejectedValue(mockResponses.preflightRequest404);
    await act(async () => {
      renderPageWithProps(Templates, defaultProps);
    });
    expect(
      screen.getByText('Something went wrong, please try reloading the page')
    ).toBeTruthy();
  });

  test('has rendered RBAC Access error component', async () => {
    api.preflightRequest.mockRejectedValue(mockResponses.preflightRequest403);
    await act(async () => {
      renderPageWithProps(Templates, defaultProps);
    });
    expect(screen.getByText('RBAC Access Denied')).toBeTruthy();
  });

  test('has rendered NoResults page component', async () => {
    api.readJobExplorer.mockResolvedValue({
      data: {
        items: [],
      },
      response: { msg: 'Success' },
      url: '/api/tower-analytics/v1/job_explorer/',
    });

    await act(async () => {
      renderPageWithProps(Templates, defaultProps);
    });

    expect(screen.getByText('No results found')).toBeTruthy();
  });

  test('has rendered Templates component with data and is clickable', async () => {
    await act(async () => {
      renderPageWithProps(Templates, defaultProps);
    });

    expect(screen.getByText('Link a template to this plan:')).toBeTruthy();

    expect(screen.getByText('test_template_name_0')).toBeTruthy();
    expect(screen.getByText('test_template_name_2')).toBeTruthy();

    fireEvent.click(screen.getByTestId('radio-345'));
    fireEvent.click(screen.getByTestId('radio-1'));
  });
});
