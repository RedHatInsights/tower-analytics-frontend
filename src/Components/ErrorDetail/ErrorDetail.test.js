import { render, screen } from '@testing-library/react';
import ErrorDetail from './ErrorDetail';

describe('<ErrorDetail />', () => {
  it('renders the expected content', async() => {
    render(
      <ErrorDetail
        error={
          new Error({
            response: {
              config: {
                method: 'post',
              },
              data: 'An error occurred',
            },
          })
        }
      />
    );
    await (() => expect(screen.getByText('Error:')).toBeTruthy());
  })

  it('testing errors', async() => {
    render(
      <ErrorDetail
        error={
          new Error({
            response: {
              config: {
                method: 'patch',
              },
              data: {
                project: ['project error'],
                inventory: ['inventory error'],
              },
            },
          })
        }
      />
    );
    await (() => {
     expect(screen.getByRole('pf-c-expandable-section__toggle')).toBeTruthy();
    });
  });
});
