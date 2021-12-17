import QueryParamsProvider from '../Provider';

describe('QueryParams/Provider', () => {
  // All the other testing is done trough consumers of the context
  it('should have exported provider', () => {
    expect(QueryParamsProvider).toBeDefined();
  });
});
