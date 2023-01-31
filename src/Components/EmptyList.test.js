import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import EmptyList from './EmptyList';

describe('EmptyList', () => {
  it('should render successfully', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <EmptyList
          label={'Add plan'}
          title={'No plans added'}
          message={'No plans have been added yet. Add your first plan.'}
          canAdd={true}
          path={'/some_link'}
        />
      </MemoryRouter>
    );
    expect(screen.getByText('No plans added')).toBeTruthy;
    expect(screen.getByRole('button')).toBeTruthy;
    expect(screen.getByText('Add plan')).toBeTruthy();
  });
});
