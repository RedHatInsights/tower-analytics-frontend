import { renderHook, act } from '@testing-library/react-hooks';
import { MemoryRouter } from 'react-router-dom';

import Provider from '../Provider';
import useQueryParams from '../useQueryParams';

// TODO Have a feeling that the useQueryParams reducer will change a bit
// when converting to ts, so the test are going to be expanded then.
describe.skip('QueryParams/useQueryParams', () => {
  const wrapper = ({ children }) => (
    <MemoryRouter>
      <Provider>{children}</Provider>
    </MemoryRouter>
  );

  it('should be defined', () => {
    expect(useQueryParams).toBeDefined();
  });

  it('should have all the exported functions defined', () => {
    const { result } = renderHook(() => useQueryParams({ a: '' }), {
      wrapper,
    });

    expect(result.current.queryParams).toEqual({ a: '' });
    expect(result.current.dispatch).toBeDefined();
    expect(result.current.setFromToolbar).toBeDefined();
    expect(result.current.setFromPagination).toBeDefined();
  });

  it('should set the attributes with single dispatch', () => {
    const { result } = renderHook(() => useQueryParams({ attributes: '' }), {
      wrapper,
    });

    act(() => {
      result.current.dispatch({
        type: 'SET_ATTRIBUTES',
        value: { attributes: ['a', 'b'], offset: '0' },
      });
    });

    expect(result.current.queryParams).toEqual({
      attributes: ['a', 'b'],
      offset: '0',
    });
  });

  it('should reset the filter', () => {
    const { result } = renderHook(() => useQueryParams({ attributes: [] }), {
      wrapper,
    });
    act(() => {
      result.current.dispatch({
        type: 'SET_ATTRIBUTES',
        value: { attributes: ['a', 'b'], offset: '0' },
      });
    });

    expect(result.current.queryParams).toEqual({
      attributes: ['a', 'b'],
      offset: '0',
    });

    act(() => {
      result.current.dispatch({ type: 'RESET_FILTER' });
    });

    expect(result.current.queryParams).toEqual({ attributes: [] });
  });
  it('should reset the offset when a filter is set via toolbar', () => {
    const { result } = renderHook(() => useQueryParams({ offset: 10 }), {
      wrapper,
    });

    act(() => {
      result.current.setFromToolbar('org_id', 1);
    });

    expect(result.current.queryParams).toEqual({ offset: '0', org_id: '1' });
  });
});
