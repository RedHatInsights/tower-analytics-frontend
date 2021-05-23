import Pagination from './Pagination';
import { render, fireEvent, screen } from '@testing-library/react';

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

  it('can render the pagination component', () => {
    render(
      <Pagination count={count} params={params} setPagination={setPagination} />
    );
  });

  it('can render the pagination component with default params', () => {
    render(<Pagination params={params} setPagination={setPagination} />);
  });

  it('calls the pagination functions', () => {
    render(
      <Pagination count={count} params={params} setPagination={setPagination} />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Go to next page' }));

    expect(setPagination).toHaveBeenCalledWith(params.limit);
    expect(setPagination).toHaveBeenCalledTimes(1);
  });

  it('can select number of items to display', () => {
    render(
      <Pagination count={count} params={params} setPagination={setPagination} />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Items per page' }));
    fireEvent.click(screen.getByText('10 per page'));

    expect(setPagination).toHaveBeenCalledWith(params.offset, 10);
    expect(setPagination).toHaveBeenCalledTimes(1);
  });
});
