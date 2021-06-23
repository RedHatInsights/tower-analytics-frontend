import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AlertModal from './AlertModal';

describe('<AlertModal />', () => {
  it('renders the expected content', () => {
    render(
      <MemoryRouter>
        <AlertModal isOpen="true" title="Danger!" variant="warning">
          Are you sure?
        </AlertModal>
      </MemoryRouter>
    );
    expect(screen.getByText('Danger!')).toBeTruthy();
  });
});
