import { parse, stringify } from 'query-string';

export const DEFAULT_NAMESPACE = 'default';

const parseNamespace = (obj) => {
  const retObj = {};
  Object.keys(obj).map((key) => {
    const namespace = key.split('.')[0];
    const attributes = key.split('.')[1];

    if (!(namespace in retObj)) retObj[namespace] = {};

    retObj[namespace][attributes] = obj[key];
  });

  return retObj;
};

const stringifyNamespace = (obj, namespace) => {
  const keyValues = Object.keys(obj).map((key) => ({
    [`${namespace}.${key}`]: obj[key],
  }));
  return Object.assign({}, ...keyValues);
};

export const parseQueryParams = (search) => {
  const parsed = parse(search, {
    parseNumbers: true,
    parseBooleans: true,
    arrayFormat: 'bracket-separator',
  });

  return parseNamespace(parsed);
};

export const stringifyQueryParams = (queryParams) => {
  const namespacedObject = Object.keys(queryParams).reduce(
    (acc, key) => ({ ...acc, ...stringifyNamespace(queryParams[key], key) }),
    {}
  );

  return stringify(namespacedObject, { arrayFormat: 'bracket-separator' });
};

export const setQueryParams = (queryParams, history) => {
  history.push({
    pathname: history.location.pathname,
    search: stringifyQueryParams(queryParams),
  });
};
