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

const handleResponse = (response: Response): Promise<ApiJson> =>
  response.json().then((json: ApiJson) => {
    if (response.ok) return Promise.resolve(json);

    const error = response.status === 403 ? 'RBAC access denied' : json;
    return Promise.reject({
      status: response.status,
      error,
    });
  });

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

export const postWithFileReturn = (
  endpoint: string,
  params: Params = {}
): Promise<void> => {
  const url = new URL(endpoint, window.location.origin);
  return authenticatedFetch(url.toString(), {
    method: 'POST',
    body: JSON.stringify(params),
  })
    .then((response) =>
      response.ok
        ? response // If reposnse is ok, then continue to download the PDF
        : response // Else it is an error and we have to parse it as a json
            .json()
            .then((error: ApiJson) =>
              Promise.reject({ status: response.status, error })
            )
    )
    .then((data) => data.body)
    .then((stream) => new Response(stream))
    .then((response) => response.blob())
    .then((blob) => {
      blob = blob.slice(0, blob.size, 'application/pdf');
      return URL.createObjectURL(blob);
    })
    .then((url) => {
      window.open(url, '_blank');
    });
};

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

export const deleteById = (endpoint: string, id: number): Promise<ApiJson> => {
  const url = new URL(`${endpoint}${id}/`, window.location.origin);
  return authenticatedFetch(url.toString(), {
    method: 'DELETE',
  }).then(handleResponse);
};

export const deleteByIds = (
  endpoint: string,
  ids: number[]
): Promise<ApiJson> => {
  const url = new URL(endpoint, window.location.origin);
  return authenticatedFetch(url.toString(), {
    method: 'DELETE',
    body: JSON.stringify(ids),
  }).then(handleResponse);
};

export const updateById = (
  endpoint: string,
  id: string,
  params: Params = {}
): Promise<ApiJson> => {
  const url = new URL(`${endpoint}${id}/`, window.location.origin);
  return authenticatedFetch(url.toString(), {
    method: 'PUT',
    body: JSON.stringify(params),
  }).then(handleResponse);
};
