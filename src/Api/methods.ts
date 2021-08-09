import { stringify } from 'query-string';
import { ApiJson, Params, ParamsWithPagination } from './types';

declare global {
  interface Window {
    insights: {
      chrome: {
        auth: {
          getUser: () => Promise<never>;
        };
      };
    };
  }
}

const handleResponse = (response: Response): Promise<ApiJson> => {
  return response.json().then((json: ApiJson) => {
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

export const authenticatedFetch = (
  endpoint: RequestInfo,
  options = {}
): Promise<Response> =>
  window.insights.chrome.auth.getUser().then(() =>
    fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  );

export const get = (
  endpoint: string,
  params: Params = {}
): Promise<ApiJson> => {
  const url = new URL(endpoint, window.location.origin);
  url.search = stringify(params);

  return authenticatedFetch(url.toString(), {
    method: 'GET',
  }).then(handleResponse);
};

export const post = (
  endpoint: string,
  params: Params = {}
): Promise<ApiJson> => {
  const url = new URL(endpoint, window.location.origin);
  return authenticatedFetch(url.toString(), {
    method: 'POST',
    body: JSON.stringify(params),
  }).then(handleResponse);
};

export const postWithPagination = (
  endpoint: string,
  params: ParamsWithPagination = {}
): Promise<ApiJson> => {
  const { limit, offset, sort_options, sort_order } = params;

  const url = new URL(endpoint, window.location.origin);
  url.search = stringify({
    limit,
    offset,
    sort_by:
      sort_options && sort_order ? `${sort_options}:${sort_order}` : undefined,
  });

  return authenticatedFetch(url.toString(), {
    method: 'POST',
    body: JSON.stringify(params),
  }).then(handleResponse);
};

export const deleteById = (endpoint: string, id: string): Promise<ApiJson> => {
  const url = new URL(endpoint + id, window.location.origin);
  return authenticatedFetch(url.toString(), {
    method: 'DELETE',
  }).then(handleResponse);
};

export const updateById = (
  endpoint: string,
  id: string,
  params: Params = {}
): Promise<ApiJson> => {
  const url = new URL(endpoint + id, window.location.origin);
  return authenticatedFetch(url.toString(), {
    method: 'PUT',
    body: JSON.stringify(params),
  }).then(handleResponse);
};
