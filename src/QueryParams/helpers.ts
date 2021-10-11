import { History } from 'history';
import { parse, ParsedQuery, stringify } from 'query-string';
import { NamespacedQueryParams, QueryParams } from './types';

export const DEFAULT_NAMESPACE = 'default';

const parseNamespace = (
  obj: ParsedQuery<string | boolean>
): NamespacedQueryParams => {
  const retObj = {} as NamespacedQueryParams;
  Object.keys(obj).map((key) => {
    const namespace = key.split('.')[0];
    const attributes = key.split('.')[1];

    if (!(namespace in retObj)) retObj[namespace] = {};

    retObj[namespace][attributes] = obj[key];
  });

  return retObj;
};

const stringifyNamespace = (
  obj: QueryParams,
  namespace: string
): QueryParams => {
  const keyValues = Object.keys(obj).map((key) => ({
    [`${namespace}.${key}`]: obj[key],
  }));

  return Object.assign({}, ...keyValues) as QueryParams;
};

export const parseQueryParams = (search: string): NamespacedQueryParams => {
  const parsed = parse(search, {
    parseNumbers: false,
    parseBooleans: true,
    arrayFormat: 'bracket-separator',
  });

  return parseNamespace(parsed);
};

export const stringifyQueryParams = (
  queryParams: NamespacedQueryParams
): string => {
  const namespacedObject = Object.keys(queryParams).reduce(
    (acc, key) => ({ ...acc, ...stringifyNamespace(queryParams[key], key) }),
    {}
  );

  return stringify(namespacedObject, { arrayFormat: 'bracket-separator' });
};

export const setQueryParams = (
  queryParams: NamespacedQueryParams,
  history: History
): void => {
  history.push({
    pathname: history.location.pathname,
    search: stringifyQueryParams(queryParams),
  });
};
