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
  afterEach(() => {
    api.preflightRequest.mockResolvedValue(mockResponses.preflightRequest200);
  });

  test('has rendered preflight/authorization error component', async () => {
    api.preflightRequest.mockRejectedValue(mockResponses.preflightRequest401);
    await act(async () => {
      renderPageWithProps(Templates, defaultProps);
    });
    expect(screen.getByText('Not authorized'));
  });

  test('has rendered Empty page component', async () => {
    api.preflightRequest.mockRejectedValue(mockResponses.preflightRequest404);
    await act(async () => {
      renderPageWithProps(Templates, defaultProps);
    });
    expect(
      screen.getByText('Something went wrong, please try reloading the page')
    );
  });

  test('has rendered RBAC Access error component', async () => {
    api.preflightRequest.mockRejectedValue(mockResponses.preflightRequest403);
    await act(async () => {
      renderPageWithProps(Templates, defaultProps);
    });
    expect(screen.getByText('RBAC Access Denied'));
  });

  test.skip('has rendered Templates component with data and is clickable', async () => {
    api.readJobExplorer.mockResolvedValue({
      data: {
        items: [
          {
            id: 345,
            name: 'test_template_name_0',
          },
        ],
      },
      response: { msg: 'Success' },
      url: '/api/tower-analytics/v1/job_explorer/',
    });
    await act(async () => {
      renderPageWithProps(Templates, defaultProps);
    });

    // expect(screen.getByText('test_template_name_0'));

    // fireEvent.click(screen.getByLabelText('Select row 2'));
    // expect(mockDispatch).toHaveBeenCallWith({
    //   type: 'SET_TEMPLATE_ID',
    //   value: 345,
    // });
  });
});
