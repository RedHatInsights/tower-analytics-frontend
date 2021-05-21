import Pagination from './Pagination';
import { render, fireEvent } from '@testing-library/react';

describe('Components/Pagination', () => {
  const params = {
    offset: 0,
    limit: 5,
  };
  const count = 15;
  const setPagination = jest.fn();

  beforeEach(() => {
    setPagination.mockReset();
  });

  it('can render the pagination component', async () => {
    render(
      <Pagination count={count} params={params} setPagination={setPagination} />
    );
  });

  it('can render the pagination component with default params', async () => {
    render(<Pagination params={params} setPagination={setPagination} />);
  });

  it('calls the pagination functions', async () => {
    const { getByRole } = render(
      <Pagination count={count} params={params} setPagination={setPagination} />
    );
    fireEvent.click(getByRole('button', { name: 'Go to next page' }));

    expect(setPagination).toHaveBeenCalledWith(5);
  });

  it('can select number of items to display', async () => {
    const { getByRole, getByText } = render(
      <Pagination count={count} params={params} setPagination={setPagination} />
    );

    fireEvent.click(getByRole('button', { name: 'Items per page' }));
    fireEvent.click(getByText('10 per page'));

    expect(setPagination).toHaveBeenCalledWith(0, 10);
  });
});
