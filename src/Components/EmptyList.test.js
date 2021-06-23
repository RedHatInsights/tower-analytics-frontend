import React from 'react';
import { render, screen } from '@testing-library/react';
import reactRouterDom from 'react-router-dom';
const pushMock = jest.fn();
reactRouterDom.useHistory = jest.fn().mockReturnValue({ push: pushMock });

jest.mock('react-router-dom', () => ({
  useLocation: jest.fn().mockReturnValue({
    pathname: '/another-route',
    search: '',
    hash: '',
    state: null,
    key: '5nvxpbdafa',
  }),
}));

import EmptyList from './EmptyList';

describe('EmptyList', () => {
  it('should render successfully', async () => {
    render(
      <EmptyList
        label={'Add plan'}
        title={'No plans added'}
        message={'No plans have been added yet. Add your first plan.'}
        canAdd={true}
        path={'/some_link'}
      />
    );
    expect(screen.getByText('No plans added')).toBeTruthy;
    expect(screen.getByRole('button')).toBeTruthy;
    expect(screen.getByText('Add plan')).toBeTruthy();
  });
});
