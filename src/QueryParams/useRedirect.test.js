import { renderHook, act } from '@testing-library/react-hooks';
import { Router } from 'react-router';
import { createMemoryHistory } from 'history';

import Provider from './Provider';
import useRedirect from './useRedirect';
import { Paths } from '../paths';

describe('QueryParams/useRedirect', () => {
  const history = createMemoryHistory();
  const wrapper = ({ children }) => (
    <Router history={history}>
      <Provider>{children}</Provider>
    </Router>
  );

  it('should use the context to redirect without params', () => {
    const { result } = renderHook(() => useRedirect(), { wrapper });

    act(() => {
      result.current(Paths.jobExplorer);
    });

    expect(history.location.pathname).toBe(Paths.jobExplorer);
  });

  it('should use the context to redirect with query', () => {
    const { result } = renderHook(() => useRedirect(), { wrapper });

    act(() => {
      result.current(Paths.jobExplorer, { n: { a: 's', b: 1, c: ['a', 'b'] } });
    });

    expect(history.location.pathname).toBe(Paths.jobExplorer);
    expect(history.location.search).toBe('?n.a=s&n.b=1&n.c[]=a,b');
  });
});
