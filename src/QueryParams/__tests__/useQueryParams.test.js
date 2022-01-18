import { renderHook, act } from '@testing-library/react-hooks';
import { Router } from 'react-router';
import { createMemoryHistory } from 'history';

import Provider from '../Provider';
import useQueryParams from '../useQueryParams';

// TODO Have a feeling that the useQueryParams reducer will change a bit
// when converting to ts, so the test are going to be expanded then.
describe('QueryParams/useQueryParams', () => {
  const history = createMemoryHistory();
  const wrapper = ({ children }) => (
    <Router history={history}>
      <Provider>{children}</Provider>
    </Router>
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
    expect(result.current.setFromCalculation).toBeDefined();
    expect(result.current.setFromTable).toBeDefined();
  });

  it('should set the attributes with single dispatch', () => {
    const { result } = renderHook(() => useQueryParams({ attributes: '' }), {
      wrapper,
    });

    act(() => {
      result.current.dispatch({
        type: 'SET_ATTRIBUTES',
        value: { attributes: ['a', 'b'] },
      });
    });

    expect(result.current.queryParams).toEqual({ attributes: ['a', 'b'] });
  });

  it('should reset the filter', () => {
    const { result } = renderHook(() => useQueryParams({ attributes: [] }), {
      wrapper,
    });
    act(() => {
      result.current.dispatch({
        type: 'SET_ATTRIBUTES',
        value: { attributes: ['a', 'b'] },
      });
    });

    expect(result.current.queryParams).toEqual({ attributes: ['a', 'b'] });

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
