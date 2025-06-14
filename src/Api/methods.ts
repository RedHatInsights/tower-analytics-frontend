import {
  addNotification,
  removeNotification,
} from '@redhat-cloud-services/frontend-components-notifications/redux';
import queryString from 'query-string';
import { createWriteStream } from 'streamsaver';
import { saveStream } from './streamSaver';
import {
  ApiJson,
  NotificationParams,
  PDFEmailParams,
  PDFParams,
  Params,
  ParamsWithPagination,
  saveROIParams,
} from './types';

interface ParamsPdf {
  pdfPostBody: PDFEmailParams;
  payload: string;
  subject: string;
  recipient: any;
  reportUrl: string;
  expiry: string;
  body: string;
  slug: string;
  token: string;
}

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

export const handleResponse = (response: Response): Promise<ApiJson> =>
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
  options = {},
): Promise<Response> =>
  // FIXME: Use chrome hook
  // eslint-disable-next-line rulesdir/no-chrome-api-call-from-window
  window.insights.chrome.auth.getUser().then(() =>
    fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
      },
    }),
  );

export const postWithFileReturn = async (
  endpoint: string,
  params: PDFParams,
  { dispatch, ...notif }: NotificationParams,
): Promise<void> => {
  const url = new URL(endpoint, window.location.origin);

  // Dispatch notification when starts the download.
  dispatch(addNotification(notif.pending(notif.id)));

  return authenticatedFetch(url.toString(), {
    method: 'POST',
    body: JSON.stringify(params),
  })
    .then((response) => {
      // Delete pending notification when we have results.
      dispatch(removeNotification(notif.id));
      return response.ok
        ? // If response is ok, then continue to download the PDF
          { response, size: response.headers.get('content-length') }
        : response // Else it is an error and we have to parse it as a json
            .json()
            .then((error: { detail: { name: string[] } }) => {
              // Add error reporting notification if we errored out.
              dispatch(
                addNotification(
                  notif.rejected(
                    notif.id,
                    error?.detail?.name
                      ? error?.detail?.name[0]
                      : // eslint-disable-next-line @typescript-eslint/no-base-to-string
                        error?.detail.toString(),
                  ),
                ),
              );
              return Promise.reject({ status: response.status, error });
            });
    })
    .then(({ response, size }) => {
      const date = new Intl.DateTimeFormat('en-US').format(new Date());
      const nSize = size ? +size : undefined;
      const fileStream = createWriteStream(
        `${params.slug}_${date}.pdf`.replace(/\s/g, '_'),
        {
          size: nSize,
        },
      );
      if (response.body) return saveStream(response.body, fileStream);
    });
};

export const postWithEmail = async (
  endpoint: string,
  params: ParamsPdf,
  { dispatch, ...notif }: NotificationParams,
): Promise<void> => {
  const url = new URL(endpoint, window.location.origin);

  // Dispatch notification when starts the download.
  dispatch(addNotification(notif.pending(notif.id, 'Processing Email')));

  return authenticatedFetch(url.toString(), {
    method: 'POST',
    body: JSON.stringify(params),
  }).then((response) => {
    // Delete pending notification when we have results.
    dispatch(removeNotification(notif.id));

    if (response.ok)
      dispatch(
        addNotification(notif.success(notif.id, 'Email sent successfully')),
      );
    else
      dispatch(
        addNotification(
          notif.rejected(notif.id, 'Error sending email, please try again.'),
        ),
      );
    return;
  });
};

export const get = (
  endpoint: string,
  params: Params = {},
): Promise<ApiJson> => {
  const url = new URL(endpoint, window.location.origin);
  url.search = queryString.stringify(params);

  return authenticatedFetch(url.toString(), {
    method: 'GET',
  }).then(handleResponse);
};

export const post = (
  endpoint: string,
  params: Params = {},
): Promise<ApiJson> => {
  const url = new URL(endpoint, window.location.origin);
  return authenticatedFetch(url.toString(), {
    method: 'POST',
    body: JSON.stringify(params),
  }).then(handleResponse);
};

export const saveROIData = (
  endpoint: string,
  params: saveROIParams,
): Promise<ApiJson> => {
  const url = new URL(endpoint, window.location.origin);
  return authenticatedFetch(url.toString(), {
    method: 'POST',
    body: JSON.stringify(params),
  }).then(handleResponse);
};

export const postWithPagination = (
  endpoint: string,
  params: ParamsWithPagination = {},
): Promise<ApiJson> => {
  const { limit, offset, sort_options, sort_order } = params;

  const url = new URL(endpoint, window.location.origin);
  url.search = queryString.stringify({
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
  ids: number[],
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
  params: Params = {},
): Promise<ApiJson> => {
  const url = new URL(`${endpoint}${id}/`, window.location.origin);
  return authenticatedFetch(url.toString(), {
    method: 'PUT',
    body: JSON.stringify(params),
  }).then(handleResponse);
};
