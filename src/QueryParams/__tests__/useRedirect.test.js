import { renderHook, act } from '@testing-library/react-hooks';
import { MemoryRouter, useLocation } from 'react-router-dom';

import Provider from '../Provider';
import useRedirect from '../useRedirect';
import { Paths } from '../../paths';

describe.skip('QueryParams/useRedirect', () => {
  const wrapper = ({ children }) => (
    <MemoryRouter>
      <Provider>{children}</Provider>
    </MemoryRouter>
  );

  it('should use the context to redirect without params', () => {
    const { result } = renderHook(() => useRedirect(), { wrapper });
    const pathname = renderHook(() => useLocation(), { wrapper });

    act(() => {
      result.current(Paths.jobExplorer);
    });
    act(() => {
      console.log(pathname.result.current.pathname);
    });
    expect(pathname).toBe(Paths.jobExplorer);
  });

  it('should use the context to redirect with query', () => {
    const { result } = renderHook(() => useRedirect(), { wrapper });
    const pathname = renderHook(() => useLocation(), { wrapper });

    act(() => {
      result.current(Paths.jobExplorer, { n: { a: 's', b: 1, c: ['a', 'b'] } });
    });

    expect(history.location.pathname).toBe(Paths.jobExplorer);
    expect(history.location.search).toBe('?n.a=s&n.b=1&n.c[]=a,b');
  });
});
