import { stringify } from 'query-string';
import { Params, ParamsWithPagination } from './types';

declare global {
  interface Window { insights: any }
}

const handleResponse = (response: Response) => {
  return response.json().then((json) => {
    if (response.ok) {
      return json;
    }

    if (response.status === 404 || response.status === 401) {
      return Promise.reject({
        status: response.status,
        message: json,
      });
    } else if (response.status === 403) {
      return Promise.reject({
        status: response.status,
        error: 'RBAC access denied',
      });
    } else {
      return Promise.reject(json);
    }
  });
};

export const authenticatedFetch = (endpoint: RequestInfo, options = {}) =>
  window.insights.chrome.auth
    .getUser()
    .then(() => fetch(endpoint, options));
  
export const get = (endpoint: string, params: Params = {}) => {
  const url = new URL(endpoint, window.location.origin);
  url.search = stringify(params);

  return authenticatedFetch(url.toString(), {
    method: 'GET'
  }).then(handleResponse);
};

export const post = (endpoint: string, params: Params = {}) => {
  const url = new URL(endpoint, window.location.origin);
  return authenticatedFetch(url.toString(), {
    method: 'POST',
    body: JSON.stringify(params),
  }).then(handleResponse);
};

export const postWithPagination = (endpoint: string, params: ParamsWithPagination = {}) => {
  const { limit, offset, sort_by } = params;

  const url = new URL(endpoint, window.location.origin);
  url.search = stringify({
    limit,
    offset,
    sort_by,
  });

  return authenticatedFetch(url.toString(), {
    method: 'POST',
    body: JSON.stringify(params),
  }).then(handleResponse);
};

export const deleteById = (endpoint: string, id: string) => {
  const url = new URL(endpoint + id, window.location.origin);
  return authenticatedFetch(url.toString(), {
    method: 'DELETE',
  }).then(handleResponse);
};

export const updateById = (endpoint: string, id: string, params: Params = {}) => {
  const url = new URL(endpoint + id, window.location.origin);
  return authenticatedFetch(url.toString(), {
    method: 'PUT',
    body: JSON.stringify(params),
  }).then(handleResponse);
};
