import { Paths } from '../../paths';
import useRedirect from '../redirectWithQueryParams';

describe.skip('QueryParams/redirect', () => {
  // All the other testing is done in the helpers tests

  it('should redirect without query', () => {
    const redirect = useRedirect(history);
    redirect(Paths.jobExplorer);

    expect(history.location.pathname).toBe(Paths.jobExplorer);
    expect(history.location.search).toBe('');
  });
});
