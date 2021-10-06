import { Paths } from '../paths';
import { createMemoryHistory } from 'history';
import useRedirect from './redirectWithQueryParams';

describe('QueryParams/redirect', () => {
  // All the other testing is done in the helpers tests
  const history = createMemoryHistory();

  it('should redirect without query', () => {
    const redirect = useRedirect(history);
    redirect(Paths.jobExplorer);

    expect(history.location.pathname).toBe(Paths.jobExplorer);
    expect(history.location.search).toBe('');
  });
});
