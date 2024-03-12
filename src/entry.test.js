import getBaseName from './Utilities/getBaseName';

describe('Utilities/getBaseName', () => {
  it('should find the right base name on Stable ', () => {
    expect(getBaseName('/insights/foo/bar/baz')).toEqual('/insights/foo');
    expect(getBaseName('/rhcs/bar/bar/baz')).toEqual('/rhcs/bar');
  });

  it('should find the right base name on Beta ', () => {
    expect(getBaseName('/preview/insights/foo/bar/baz')).toEqual(
      '/preview/insights/foo'
    );
    expect(getBaseName('/preview/test/fff/bar/baz')).toEqual(
      '/preview/test/fff'
    );
  });
});
