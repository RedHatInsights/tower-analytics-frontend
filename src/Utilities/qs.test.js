import {
  encodeQueryString,
  encodeNonDefaultQueryString,
  parseQueryString,
  getQSConfig,
  removeParams,
  _stringToObject,
  _addDefaultsToObject,
  mergeParams,
  replaceParams,
} from './qs';

describe('qs (qs.js)', () => {
  describe('encodeQueryString', () => {
    test('encodeQueryString returns the expected queryString', () => {
      [
        [null, ''],
        [{}, ''],
        [
          { order_by: 'name', offset: 1, limit: 5 },
          'limit=5&offset=1&order_by=name',
        ],
        [
          { '-order_by': 'name', offset: '1', limit: 5 },
          '-order_by=name&limit=5&offset=1',
        ],
      ].forEach(([params, expectedQueryString]) => {
        const actualQueryString = encodeQueryString(params);

        expect(actualQueryString).toEqual(expectedQueryString);
      });
    });

    test('encodeQueryString omits null values', () => {
      const vals = {
        order_by: 'name',
        offset: null,
      };
      expect(encodeQueryString(vals)).toEqual('order_by=name');
    });

    test('should encode array params', () => {
      const vals = {
        foo: ['one', 'two', 'three'],
      };
      expect(encodeQueryString(vals)).toEqual('foo=one&foo=two&foo=three');
    });
  });

  describe('encodeNonDefaultQueryString', () => {
    const config = {
      namespace: null,
      defaultParams: { offset: 1, limit: 5, order_by: 'name' },
      integerFields: ['offset'],
    };

    test('should return the expected queryString', () => {
      [
        [null, ''],
        [{}, ''],
        [
          { order_by: 'name', offset: 1, limit: 5 },
          'limit=5&offset=1&order_by=name',
        ],
        [
          { order_by: '-name', offset: 1, limit: 5 },
          'limit=5&offset=1&order_by=-name',
        ],
        [
          { order_by: '-name', offset: 3, limit: 10 },
          'limit=10&offset=3&order_by=-name',
        ],
        [
          { order_by: '-name', offset: 3, limit: 10, foo: 'bar' },
          'foo=bar&limit=10&offset=3&order_by=-name',
        ],
      ].forEach(([params, expectedQueryString]) => {
        const actualQueryString = encodeNonDefaultQueryString(config, params);
        expect(actualQueryString).toEqual(expectedQueryString);
      });
    });

    test('should omit null values', () => {
      const vals = {
        order_by: 'foo',
        offset: null,
      };
      expect(encodeNonDefaultQueryString(config, vals)).toEqual('order_by=foo');
    });

    test('should namespace encoded params', () => {
      const conf = {
        namespace: 'item',
        defaultParams: { offset: 1 },
      };
      const params = {
        offset: 1,
        foo: 'bar',
      };
      expect(encodeNonDefaultQueryString(conf, params)).toEqual(
        'item.foo=bar&item.offset=1'
      );
    });

    test('should handle array values', () => {
      const vals = {
        foo: ['one', 'two'],
        bar: ['alpha', 'beta'],
      };
      const conf = {
        defaultParams: {
          foo: ['one', 'two'],
        },
      };
      expect(encodeNonDefaultQueryString(conf, vals)).toEqual(
        'bar=alpha&bar=beta&foo=one&foo=two'
      );
    });
  });

  describe('getQSConfig', () => {
    test('should get default QS config object', () => {
      expect(getQSConfig('organization')).toEqual({
        namespace: 'organization',
        defaultParams: { offset: 1, limit: 5, sort_options: 'name' },
        integerFields: ['offset', 'limit'],
        dateFields: ['modified', 'created'],
      });
    });

    test('should set order_by in defaultParams if it is not passed', () => {
      expect(
        getQSConfig('organization', {
          offset: 1,
          limit: 5,
          sort_options: 'name',
        })
      ).toEqual({
        namespace: 'organization',
        defaultParams: { offset: 1, limit: 5, sort_options: 'name' },
        integerFields: ['offset', 'limit'],
        dateFields: ['modified', 'created'],
      });
    });

    test('should throw if no namespace given', () => {
      expect(() => getQSConfig()).toThrow();
    });

    test('should build configured QS config object', () => {
      const defaults = {
        offset: 1,
        limit: 15,
        sort_options: 'name',
      };
      expect(getQSConfig('inventory', defaults)).toEqual({
        namespace: 'inventory',
        defaultParams: { offset: 1, limit: 15, sort_options: 'name' },
        integerFields: ['offset', 'limit'],
        dateFields: ['modified', 'created'],
      });
    });
  });

  describe('parseQueryString', () => {
    test('should get query params', () => {
      const config = {
        namespace: 'item',
        defaultParams: { offset: 1, limit: 15 },
        integerFields: ['offset', 'limit'],
      };
      const query = '?item.baz=bar&item.offset=3';
      expect(parseQueryString(config, query)).toEqual({
        baz: 'bar',
        offset: 3,
        limit: 15,
      });
    });

    test('should return namespaced defaults if empty query string passed', () => {
      const config = {
        namespace: 'foo',
        defaultParams: { offset: 1, limit: 15 },
        integerFields: ['offset', 'limit'],
      };
      const query = '';
      expect(parseQueryString(config, query)).toEqual({
        offset: 1,
        limit: 15,
      });
    });

    test('should get query params with correct integer fields', () => {
      const config = {
        namespace: 'item',
        defaultParams: {},
        integerFields: ['offset', 'foo'],
      };
      const query = '?item.foo=4&item.bar=5';
      expect(parseQueryString(config, query)).toEqual({
        foo: 4,
        bar: '5',
      });
    });

    test('should decode parsed params', () => {
      const config = {
        namespace: 'item',
        defaultParams: {},
        integerFields: ['offset'],
      };
      const query = '?item.foo=bar%20baz';
      expect(parseQueryString(config, query)).toEqual({
        foo: 'bar baz',
      });
    });

    test('should decode param keys', () => {
      const config = {
        namespace: 'item',
        defaultParams: {},
        integerFields: ['offset'],
      };
      const query = '?item.foo%20bar=baz';
      expect(parseQueryString(config, query)).toEqual({
        'foo bar': 'baz',
      });
    });

    test('should get namespaced query params', () => {
      const config = {
        namespace: 'inventory',
        defaultParams: { offset: 1, limit: 5 },
        integerFields: ['offset', 'limit'],
      };
      const query = '?inventory.offset=2&inventory.order_by=name&other=15';
      expect(parseQueryString(config, query)).toEqual({
        offset: 2,
        order_by: 'name',
        limit: 5,
      });
    });

    test('should exclude other namespaced query params', () => {
      const config = {
        namespace: 'inventory',
        defaultParams: { offset: 1, limit: 5 },
        integerFields: ['offset', 'limit'],
      };
      const query = '?inventory.offset=2&inventory.order_by=name&foo.other=15';
      expect(parseQueryString(config, query)).toEqual({
        offset: 2,
        order_by: 'name',
        limit: 5,
      });
    });

    test('should exclude other namespaced default query params', () => {
      const config = {
        namespace: 'inventory',
        defaultParams: { offset: 1, limit: 5 },
        integerFields: ['offset', 'limit'],
      };
      const query = '?foo.offset=2&inventory.order_by=name&foo.other=15';
      expect(parseQueryString(config, query)).toEqual({
        offset: 1,
        order_by: 'name',
        limit: 5,
      });
    });

    test('should add duplicate non-default params as array', () => {
      const config = {
        namespace: 'item',
        defaultParams: { offset: 1, limit: 15 },
        integerFields: ['offset', 'limit'],
      };
      const query = '?item.baz=bar&item.baz=boo&item.offset=3';
      expect(parseQueryString(config, query)).toEqual({
        baz: ['bar', 'boo'],
        offset: 3,
        limit: 15,
      });
    });

    test('should add duplicate namespaced non-default params as array', () => {
      const config = {
        namespace: 'bee',
        defaultParams: { offset: 1, limit: 15 },
        integerFields: ['offset', 'limit'],
      };
      const query = '?bee.baz=bar&bee.baz=boo&bee.offset=3';
      expect(parseQueryString(config, query)).toEqual({
        baz: ['bar', 'boo'],
        offset: 3,
        limit: 15,
      });
    });

    test('should parse long arrays', () => {
      const config = {
        namespace: 'item',
      };
      const query = '?item.baz=one&item.baz=two&item.baz=three';
      expect(parseQueryString(config, query)).toEqual({
        baz: ['one', 'two', 'three'],
      });
    });

    test('should handle non-namespaced params', () => {
      const config = {
        namespace: null,
        defaultParams: { offset: 1, limit: 15 },
        integerFields: ['offset', 'limit'],
      };
      const query = '?item.baz=bar&offset=3';
      expect(parseQueryString(config, query)).toEqual({
        offset: 3,
        limit: 15,
      });
    });

    test('should parse empty string values', () => {
      const config = {
        namespace: 'bee',
        defaultParams: { offset: 1, limit: 15 },
        integerFields: ['offset', 'limit'],
      };
      const query = '?bee.baz=bar&bee.or__source=';
      expect(parseQueryString(config, query)).toEqual({
        baz: 'bar',
        offset: 1,
        limit: 15,
        or__source: '',
      });
    });
  });

  describe('removeParams', () => {
    test('should remove query params', () => {
      const config = {
        namespace: null,
        defaultParams: { offset: 1, limit: 15 },
        integerFields: ['offset', 'limit'],
      };
      const oldParams = { baz: 'bar', offset: 3, bag: 'boom', limit: 15 };
      const toRemove = { bag: 'boom' };
      expect(removeParams(config, oldParams, toRemove)).toEqual({
        baz: 'bar',
        offset: 3,
        limit: 15,
      });
    });

    test('should remove query params with duplicates (array -> string)', () => {
      const config = {
        namespace: null,
        defaultParams: { offset: 1, limit: 15 },
        integerFields: ['offset', 'limit'],
      };
      const oldParams = { baz: ['bar', 'bang'], offset: 3, limit: 15 };
      const toRemove = { baz: 'bar' };
      expect(removeParams(config, oldParams, toRemove)).toEqual({
        baz: 'bang',
        offset: 3,
        limit: 15,
      });
    });

    test('should remove query params with duplicates (array -> smaller array)', () => {
      const config = {
        namespace: null,
        defaultParams: { offset: 1, limit: 15 },
        integerFields: ['offset', 'limit'],
      };
      const oldParams = {
        baz: ['bar', 'bang', 'bust'],
        offset: 3,
        limit: 15,
      };
      const toRemove = { baz: 'bar' };
      expect(removeParams(config, oldParams, toRemove)).toEqual({
        baz: ['bang', 'bust'],
        offset: 3,
        limit: 15,
      });
    });

    test('should remove multiple values from query params (array -> smaller array)', () => {
      const config = {
        namespace: null,
        defaultParams: { offset: 1, limit: 15 },
        integerFields: ['offset', 'limit'],
      };
      const oldParams = {
        baz: ['bar', 'bang', 'bust'],
        offset: 3,
        limit: 15,
      };
      const toRemove = { baz: ['bang', 'bar'] };
      expect(removeParams(config, oldParams, toRemove)).toEqual({
        baz: 'bust',
        offset: 3,
        limit: 15,
      });
    });

    test('should reset query params that have default keys back to default values', () => {
      const config = {
        namespace: null,
        defaultParams: { offset: 1, limit: 15 },
        integerFields: ['offset', 'limit'],
      };
      const oldParams = { baz: ['bar', 'bang'], offset: 3, limit: 15 };
      const toRemove = { offset: 3 };
      expect(removeParams(config, oldParams, toRemove)).toEqual({
        baz: ['bar', 'bang'],
        offset: 1,
        limit: 15,
      });
    });

    test('should remove multiple params', () => {
      const config = {
        namespace: null,
        defaultParams: { offset: 1, limit: 15 },
        integerFields: ['offset', 'limit'],
      };
      const oldParams = {
        baz: ['bar', 'bang', 'bust'],
        pat: 'pal',
        offset: 3,
        limit: 15,
      };
      const toRemove = { baz: 'bust', pat: 'pal' };
      expect(removeParams(config, oldParams, toRemove)).toEqual({
        baz: ['bar', 'bang'],
        offset: 3,
        limit: 15,
      });
    });

    test('should remove namespaced query params', () => {
      const config = {
        namespace: 'item',
        defaultParams: { offset: 1, limit: 15 },
        integerFields: ['offset', 'limit'],
      };
      const oldParams = { baz: 'bar', offset: 3, limit: 15 };
      const toRemove = { baz: 'bar' };
      expect(removeParams(config, oldParams, toRemove)).toEqual({
        offset: 3,
        limit: 15,
      });
    });

    test('should not include other namespaced query params when removing', () => {
      const config = {
        namespace: 'item',
        defaultParams: { offset: 1, limit: 15 },
        integerFields: ['offset', 'limit'],
      };
      const oldParams = { baz: 'bar', offset: 1, limit: 15 };
      const toRemove = { baz: 'bar' };
      expect(removeParams(config, oldParams, toRemove)).toEqual({
        offset: 1,
        limit: 15,
      });
    });

    test('should remove namespaced query params with duplicates (array -> string)', () => {
      const config = {
        namespace: 'item',
        defaultParams: { offset: 1, limit: 15 },
        integerFields: ['offset', 'limit'],
      };
      const oldParams = { baz: ['bar', 'bang'], offset: 3, limit: 15 };
      const toRemove = { baz: 'bar' };
      expect(removeParams(config, oldParams, toRemove)).toEqual({
        baz: 'bang',
        offset: 3,
        limit: 15,
      });
    });

    test('should remove namespaced query params with duplicates (array -> smaller array)', () => {
      const config = {
        namespace: 'item',
        defaultParams: { offset: 1, limit: 15 },
        integerFields: ['offset', 'limit'],
      };
      const oldParams = {
        baz: ['bar', 'bang', 'bust'],
        offset: 3,
        limit: 15,
      };
      const toRemove = { baz: 'bar' };
      expect(removeParams(config, oldParams, toRemove)).toEqual({
        baz: ['bang', 'bust'],
        offset: 3,
        limit: 15,
      });
    });

    test('should reset namespaced query params that have default keys back to default values', () => {
      const config = {
        namespace: 'item',
        defaultParams: { offset: 1, limit: 15 },
        integerFields: ['offset', 'limit'],
      };
      const oldParams = { baz: ['bar', 'bang'], offset: 3, limit: 15 };
      const toRemove = { offset: 3 };
      expect(removeParams(config, oldParams, toRemove)).toEqual({
        baz: ['bar', 'bang'],
        offset: 1,
        limit: 15,
      });
    });

    test('should retain long array values', () => {
      const config = {
        namespace: 'item',
        defaultParams: { offset: 1, limit: 15 },
        integerFields: ['offset', 'limit'],
      };
      const oldParams = {
        baz: ['one', 'two', 'three'],
        offset: 3,
        bag: 'boom',
        limit: 15,
      };
      const toRemove = { bag: 'boom' };
      expect(removeParams(config, oldParams, toRemove)).toEqual({
        baz: ['one', 'two', 'three'],
        offset: 3,
        limit: 15,
      });
    });

    test('should remove multiple namespaced params', () => {
      const config = {
        namespace: 'item',
        defaultParams: { offset: 1, limit: 15 },
        integerFields: ['offset', 'limit'],
      };
      const oldParams = {
        baz: ['bar', 'bang', 'bust'],
        pat: 'pal',
        offset: 3,
        limit: 15,
      };
      const toRemove = { baz: 'bust', pat: 'pal' };
      expect(removeParams(config, oldParams, toRemove)).toEqual({
        baz: ['bar', 'bang'],
        offset: 3,
        limit: 15,
      });
    });

    test('should retain empty string', () => {
      const config = {
        namespace: null,
        defaultParams: { offset: 1, limit: 15 },
        integerFields: ['offset', 'limit'],
      };
      const oldParams = { baz: '', offset: 3, bag: 'boom', limit: 15 };
      const toRemove = { bag: 'boom' };
      expect(removeParams(config, oldParams, toRemove)).toEqual({
        baz: '',
        offset: 3,
        limit: 15,
      });
    });
  });

  describe('_stringToObject', () => {
    test('should convert to object', () => {
      const config = { namespace: 'unit' };
      expect(_stringToObject(config, '?unit.foo=bar&unit.baz=bam')).toEqual({
        foo: 'bar',
        baz: 'bam',
      });
    });

    test('should convert duplicated keys to array', () => {
      const config = { namespace: 'unit' };
      expect(_stringToObject(config, '?unit.foo=bar&unit.foo=bam')).toEqual({
        foo: ['bar', 'bam'],
      });
    });

    test('should omit keys from other namespaces', () => {
      const config = { namespace: 'unit' };
      expect(
        _stringToObject(config, '?unit.foo=bar&other.bar=bam&one=two')
      ).toEqual({
        foo: 'bar',
      });
    });

    test('should convert numbers to correct type', () => {
      const config = {
        namespace: 'unit',
        integerFields: ['offset'],
      };
      expect(_stringToObject(config, '?unit.offset=3')).toEqual({
        offset: 3,
      });
    });
  });

  describe('_addDefaultsToObject', () => {
    test('should add missing default values', () => {
      const config = {
        defaultParams: { offset: 1, limit: 5, order_by: 'name' },
      };
      expect(_addDefaultsToObject(config, {})).toEqual({
        offset: 1,
        limit: 5,
        order_by: 'name',
      });
    });

    test('should not override existing params', () => {
      const config = {
        defaultParams: { offset: 1, limit: 5, order_by: 'name' },
      };
      const params = {
        offset: 2,
        order_by: 'date_created',
      };
      expect(_addDefaultsToObject(config, params)).toEqual({
        offset: 2,
        limit: 5,
        order_by: 'date_created',
      });
    });

    test('should handle missing defaultParams', () => {
      const params = {
        offset: 2,
        order_by: 'date_created',
      };
      expect(_addDefaultsToObject({}, params)).toEqual({
        offset: 2,
        order_by: 'date_created',
      });
    });
  });

  describe('mergeParams', () => {
    it('should merge param into an array', () => {
      const oldParams = {
        foo: 'one',
      };
      const newParams = {
        foo: 'two',
      };
      expect(mergeParams(oldParams, newParams)).toEqual({
        foo: ['one', 'two'],
      });
    });

    it('should not remove empty string values', () => {
      const oldParams = {
        foo: '',
      };
      const newParams = {
        foo: 'two',
      };
      expect(mergeParams(oldParams, newParams)).toEqual({
        foo: ['', 'two'],
      });

      const oldParams2 = {
        foo: 'one',
      };
      const newParams2 = {
        foo: '',
      };
      expect(mergeParams(oldParams2, newParams2)).toEqual({
        foo: ['one', ''],
      });
    });

    it('should retain unaltered params', () => {
      const oldParams = {
        foo: 'one',
        bar: 'baz',
      };
      const newParams = {
        foo: 'two',
      };
      expect(mergeParams(oldParams, newParams)).toEqual({
        foo: ['one', 'two'],
        bar: 'baz',
      });
    });

    it('should gather params from both objects', () => {
      const oldParams = {
        one: 'one',
      };
      const newParams = {
        two: 'two',
      };
      expect(mergeParams(oldParams, newParams)).toEqual({
        one: 'one',
        two: 'two',
      });
    });

    it('should append value to existing array', () => {
      const oldParams = {
        foo: ['one', 'two'],
      };
      const newParams = {
        foo: 'three',
      };
      expect(mergeParams(oldParams, newParams)).toEqual({
        foo: ['one', 'two', 'three'],
      });
    });

    it('should append array to existing value', () => {
      const oldParams = {
        foo: 'one',
      };
      const newParams = {
        foo: ['two', 'three'],
      };
      expect(mergeParams(oldParams, newParams)).toEqual({
        foo: ['one', 'two', 'three'],
      });
    });

    it('should merge two arrays', () => {
      const oldParams = {
        foo: ['one', 'two'],
      };
      const newParams = {
        foo: ['three', 'four'],
      };
      expect(mergeParams(oldParams, newParams)).toEqual({
        foo: ['one', 'two', 'three', 'four'],
      });
    });

    it('should prevent exact duplicates', () => {
      const oldParams = { foo: 'one' };
      const newParams = { foo: 'one' };
      expect(mergeParams(oldParams, newParams)).toEqual({ foo: 'one' });
    });

    it('should prevent exact duplicates in arrays', () => {
      const oldParams = { foo: ['one', 'three'] };
      const newParams = { foo: ['one', 'two'] };
      expect(mergeParams(oldParams, newParams)).toEqual({
        foo: ['one', 'three', 'two'],
      });
    });

    it('should add multiple params', () => {
      const oldParams = { baz: ['bar', 'bang'], offset: 3, limit: 15 };
      const newParams = { baz: 'bust', pat: 'pal' };
      expect(mergeParams(oldParams, newParams)).toEqual({
        baz: ['bar', 'bang', 'bust'],
        pat: 'pal',
        offset: 3,
        limit: 15,
      });
    });
  });

  describe('replaceParams', () => {
    it('should collect params into one object', () => {
      const oldParams = { foo: 'one' };
      const newParams = { bar: 'two' };
      expect(replaceParams(oldParams, newParams)).toEqual({
        foo: 'one',
        bar: 'two',
      });
    });

    it('should retain unaltered params', () => {
      const oldParams = {
        foo: 'one',
        bar: 'baz',
      };
      const newParams = { foo: 'two' };
      expect(replaceParams(oldParams, newParams)).toEqual({
        foo: 'two',
        bar: 'baz',
      });
    });

    it('should override old values with new ones', () => {
      const oldParams = {
        foo: 'one',
        bar: 'three',
      };
      const newParams = {
        foo: 'two',
        baz: 'four',
      };
      expect(replaceParams(oldParams, newParams)).toEqual({
        foo: 'two',
        bar: 'three',
        baz: 'four',
      });
    });

    it('should handle exact duplicates', () => {
      const oldParams = { foo: 'one' };
      const newParams = { foo: 'one', bar: 'two' };
      expect(replaceParams(oldParams, newParams)).toEqual({
        foo: 'one',
        bar: 'two',
      });
    });
  });
});
