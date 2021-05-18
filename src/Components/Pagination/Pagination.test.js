import Pagination from './Pagination';
import { render, fireEvent, screen } from '@testing-library/react';

test('User sees pagination UI', async () => {
  const foo = jest.fn();
  const bar = jest.fn();
  const baz = jest.fn();
  render(
    <Pagination
      count={15}
      limit={5}
      handleSetLimit={foo}
      handleSetOffset={bar}
      handleSetCurrPage={baz}
      currPage={1}
    />
  );
});

test('User can paginate', async () => {
  const foo = jest.fn();
  const bar = jest.fn();
  const baz = jest.fn();
  render(
    <Pagination
      count={15}
      limit={5}
      handleSetLimit={foo}
      handleSetOffset={bar}
      handleSetCurrPage={baz}
      currPage={1}
    />
  );
  fireEvent.click(screen.getByRole('button', { name: 'Go to next page' }));

  expect(bar).toHaveBeenCalled();
  expect(baz).toHaveBeenCalled();
});

test('User can select number of items to display', async () => {
  const foo = jest.fn();
  const bar = jest.fn();
  const baz = jest.fn();
  render(
    <Pagination
      count={15}
      limit={5}
      handleSetLimit={foo}
      handleSetOffset={bar}
      handleSetCurrPage={baz}
      currPage={1}
    />
  );
  fireEvent.click(screen.getByRole('button', { name: 'Items per page' }));
  fireEvent.click(screen.getByText('10 per page'));

  expect(foo).toHaveBeenCalled();
});
