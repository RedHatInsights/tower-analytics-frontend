import {
  useQueryParams,
  QueryParamsProvider,
  DEFAULT_NAMESPACE,
} from '../';

describe('QueryParams/index', () => {
  it('should have exported members', () => {
    expect(useQueryParams).toBeDefined();
    expect(QueryParamsProvider).toBeDefined();
    expect(DEFAULT_NAMESPACE).toBeDefined();
  });
});
