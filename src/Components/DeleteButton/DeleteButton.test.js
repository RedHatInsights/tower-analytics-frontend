import { readPlan } from '../../Api';
import { act } from 'react-dom/test-utils';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import DeleteButton from './DeleteButton';

import mockResponses from '../../Utilities/__fixtures__/';
import * as api from '../../Api';
jest.mock('../../Api');

describe('<DeleteButton />', () => {
  test('should render button', async () => {
    render (
      <DeleteButton onConfirm={() => {}} name="Foo" />
    );
    await (() => screen.getById('button'));
  });

  test('should open confirmation modal', async() => {
    render (
        <DeleteButton
          onConfirm={() => {}}
          name="Foo"
          deleteDetailsRequests={[
            {
              label: 'Plan',
              request: readPlan.mockResolvedValue({
                data: { count: 1 },
              }),
            },
          ]}
          deleteMessage="Delete this?"
          warningMessage="Are you sure to want to delete this"
        />
    )
    expect(screen.getByLabelText('Delete'));
    const button = await waitFor(() => screen.getByRole('button'));
    await act(async () => {
      fireEvent.click(button)
    });
    expect(screen.getByLabelText('Alert modal')).toBeTruthy();
  });

  test('should show delete details error', async () => {
      const onConfirm = jest.fn();
      render (
        <DeleteButton
          onConfirm={onConfirm}
          itemsToDelete="foo"
          deleteDetailsRequests={[
            {
              label: 'Plan',
              request: api.preflightRequest.mockRejectedValue(mockResponses.preflightRequest403),
            },
          ]}
        />
      );
      expect(screen.getByRole('button')).toBeTruthy();
      const button = screen.getByRole('button');
      await act(async () => {
          fireEvent.click(button)
      });
      expect(screen.getByText('Error!')).toBeTruthy();
  })
});
