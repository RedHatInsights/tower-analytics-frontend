import { parseQueryParams, stringifyQueryParams } from './helpers';

describe('QueryParams/helpers', () => {
  it('should encode null and empty query params correctly', () => {
    [
      [{ n: { order_by: null } }, 'n.order_by'],
      [{}, ''],
    ].forEach(([params, expectedQueryString]) => {
      expect(stringifyQueryParams(params)).toEqual(expectedQueryString);
    });
  });

  it('should decode null and empty query params correctly', () => {
    [
      [{ n: { order_by: null } }, 'n.order_by'],
      [{}, ''],
    ].forEach(([params, string]) => {
      expect(parseQueryParams(string)).toEqual(params);
    });
  });

  it('should encode boolean values correctly', () => {
    expect(stringifyQueryParams({ n: { b: true, f: false } })).toEqual(
      'n.b=true&n.f=false'
    );
  });

  it('should decode boolean values correctly', () => {
    expect(parseQueryParams('n.b=true&n.f=false')).toEqual({
      n: { b: true, f: false },
    });
  });

  it('should encode empty array values correctly', () => {
    expect(stringifyQueryParams({ n: { empty_array: [] } })).toEqual(
      'n.empty_array[]'
    );
  });

  it('should decode empty array values correctly', () => {
    expect(parseQueryParams('n.empty_array[]')).toEqual({
      n: { empty_array: [] },
    });
  });

  it('should encode array values correctly', () => {
    expect(stringifyQueryParams({ n: { array: ['chicken', 'egg'] } })).toEqual(
      'n.array[]=chicken,egg'
    );
  });

  it('should decode array values correctly', () => {
    expect(parseQueryParams('n.array[]=chicken,egg')).toEqual({
      n: { array: ['chicken', 'egg'] },
    });
  });

  it('should encode string values correctly', () => {
    expect(
      stringifyQueryParams({
        n: { string_one: '', string_two: 'string' },
      })
    ).toEqual('n.string_one=&n.string_two=string');
  });

  it('should decode string values correctly', () => {
    expect(parseQueryParams('n.string_one=&n.string_two=string')).toEqual({
      n: { string_one: '', string_two: 'string' },
    });
  });

  it('should encode integer values correctly', () => {
    expect(
      stringifyQueryParams({
        n: { int_array: [1, 2, 3], integer_one: 5 },
      })
    ).toEqual('n.int_array[]=1,2,3&n.integer_one=5');
  });

  it('should decode integer values correctly', () => {
    // We are not parsing them as numbers since toolbar needs string
    // and it is enforced by the TS
    expect(parseQueryParams('n.int_array[]=1,2,3&n.integer_one=5')).toEqual({
      n: { int_array: ['1', '2', '3'], integer_one: '5' },
    });
  });

  it('should encode multiple namespaces correctly', () => {
    expect(
      stringifyQueryParams({
        n: { empty_array: [], str: 'egg', number: 5 },
        m: { str: 'chicken' },
      })
    ).toEqual('m.str=chicken&n.empty_array[]&n.number=5&n.str=egg');
  });

  it('should decode multiple namespaces correctly', () => {
    expect(
      parseQueryParams('m.str=chicken&n.empty_array[]&n.number=5&n.str=egg')
    ).toEqual({
      n: { empty_array: [], str: 'egg', number: '5' },
      m: { str: 'chicken' },
    });
  });

  it('should encode attributes with string keys correctly', () => {
    expect(
      stringifyQueryParams({
        n: { '-empty_array': [], '-str': 'egg', '-number': 5 },
      })
    ).toEqual('n.-empty_array[]&n.-number=5&n.-str=egg');
  });

  it('should decode attributes with string keys correctly', () => {
    expect(parseQueryParams('n.-empty_array[]&n.-number=5&n.-str=egg')).toEqual(
      {
        n: { '-empty_array': [], '-str': 'egg', '-number': '5' },
      }
    );
  });
});
