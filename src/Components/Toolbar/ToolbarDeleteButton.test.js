import React from 'react';
import { act } from 'react-dom/test-utils';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { readPlan } from '../../Api/';
import ToolbarDeleteButton from './ToolbarDeleteButton';
jest.mock('../../Api');

const itemA = {
  id: 1,
  name: 'Foo',
  summary_fields: { user_capabilities: { delete: true } },
};

describe('<ToolbarDeleteButton />', () => {
  let deleteDetailsRequests;
  beforeEach(() => {
    deleteDetailsRequests = [
      {
        label: 'Plan',
        request: readPlan.mockImplementation(() =>
          Promise.resolve({ items: { count: 1 } })
        ),
      },
    ];
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should render button', () => {
    render(<ToolbarDeleteButton onDelete={() => {}} itemsToDelete={[]} />);
    expect(screen.getByRole('button')).toBeTruthy();
  });

  test('should open confirmation modal', async () => {
    render(
      <ToolbarDeleteButton
        onDelete={() => {}}
        itemsToDelete={[itemA]}
        deleteDetailsRequests={deleteDetailsRequests}
        deleteMessage='Delete this?'
        warningMessage='Are you sure to want to delete this'
      />
    );
    expect(screen.getByLabelText('Delete'));
    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });
    expect(screen.getByLabelText('Alert modal')).toBeTruthy();
  });

  test('should open confirmation with enabled delete button modal', async () => {
    await act(async () => {
      render(
        <ToolbarDeleteButton
          onDelete={() => {}}
          itemsToDelete={[
            {
              name: 'foo',
              id: 1,
            },
            {
              name: 'bar',
              id: 2,
            },
          ]}
          deleteDetailsRequests={deleteDetailsRequests}
          deleteMessage='Delete this?'
          warningMessage='Are you sure to want to delete this'
        />
      );
    });
    expect(screen.getByLabelText('Delete'));
    const button = await waitFor(() => screen.getByRole('button'));
    await act(async () => {
      fireEvent.click(button);
    });
    expect(screen.getByLabelText('Alert modal')).toBeTruthy();
    expect(
      screen
        .getByLabelText('confirm delete')
        .closest('button')
        .hasAttribute('disabled')
    ).toBe(false);
  });

  test('should disable confirm delete button', async () => {
    const request = {
      request: readPlan.mockImplementation(() =>
        Promise.resolve({ items: { count: 3 } })
      ),
      label: 'Plan',
    };
    await act(async () => {
      render(
        <ToolbarDeleteButton
          onDelete={() => {}}
          itemsToDelete={[
            {
              name: 'foo',
              id: 1,
            },
          ]}
          deleteDetailsRequests={[request]}
          deleteMessage='Delete this?'
          warningMessage='Are you sure to want to delete this'
        />
      );
    });

    expect(screen.getByLabelText('Delete'));
    const button = await waitFor(() => screen.getByRole('button'));
    await act(async () => {
      fireEvent.click(button);
    });
    expect(screen.getByLabelText('Alert modal')).toBeTruthy();
    expect(
      screen
        .getByLabelText('confirm delete')
        .closest('button')
        .hasAttribute('disabled')
    ).toBe(true);
  });

  test('should open delete error modal', async () => {
    const request = {
      label: 'Plan',
      request: readPlan.mockImplementation(() =>
        Promise.reject({ response: { data: 'An error occurred', status: 403 } })
      ),
    };

    await act(async () => {
      render(
        <ToolbarDeleteButton
          onDelete={() => {}}
          itemsToDelete={[itemA]}
          deleteDetailsRequests={[request]}
          deleteMessage='Delete this?'
          warningMessage='Are you sure to want to delete this'
        />
      );
    });

    const button = await waitFor(() => screen.getByRole('button'));
    await act(async () => {
      fireEvent.click(button);
    });
    expect(screen.getByLabelText('Alert modal')).toBeTruthy();
    expect(screen.getByText('Error!')).toBeTruthy();
  });

  test('should invoke onDelete prop', async () => {
    const onDelete = jest.fn();
    render(<ToolbarDeleteButton onDelete={onDelete} itemsToDelete={[itemA]} />);
    const button = await waitFor(() => screen.getByRole('button'));
    await act(async () => {
      fireEvent.click(button);
    });
    expect(screen.getByLabelText('Alert modal')).toBeTruthy();
    expect(
      screen
        .getByLabelText('confirm delete')
        .closest('button')
        .hasAttribute('disabled')
    ).toBe(false);
    const deleteButton = screen.getByLabelText('confirm delete');
    await act(async () => {
      fireEvent.click(deleteButton);
    });
    expect(screen.queryByLabelText('Alert modal')).toBe(null);
  });
});
