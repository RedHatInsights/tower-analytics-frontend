import { parse, stringify } from 'query-string';

export const DEFAULT_NAMESPACE = 'default';

export const removeNamespace = (obj) => {
  const keyValues = Object.keys(obj).map((key) => {
    const newKey = key.split('.')[1] || key;
    return { [newKey]: obj[key] };
  });
  return Object.assign({}, ...keyValues);
};

export const addNamespace = (obj, namespace) => {
  const keyValues = Object.keys(obj).map((key) => ({
    [`${namespace}.${key}`]: obj[key],
  }));
  return Object.assign({}, ...keyValues);
};

export const parseQueryParams = (search) => {
  return parse(search, {
    parseNumbers: true,
    parseBooleans: true,
    arrayFormat: 'bracket',
  });
};

export const setQueryParams = (namespace, queryParams, history) => {
  const newQueryParams = {
    ...parseQueryParams(history.location.search),
    [namespace]: queryParams,
  };

  history.push({
    pathname: history.location.pathname,
    search: stringify(newQueryParams, { arrayFormat: 'bracket' }),
  });
};
