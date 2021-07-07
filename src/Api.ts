declare global {
  interface Window { insights: any }
}
import { stringify } from 'query-string';
/* v0 endpoints */
export const clustersEndpoint = `/api/tower-analytics/v0/clusters/`;
export const notificationsEndpoint = `/api/tower-analytics/v0/notifications/`;
export const preflightEndpoint = `/api/tower-analytics/v0/authorized/`;

/* v1 endpoints */
export const jobExplorerEndpoint = '/api/tower-analytics/v1/job_explorer/';
export const hostExplorerEndpoint = '/api/tower-analytics/v1/host_explorer/';
export const eventExplorerEndpoint = '/api/tower-analytics/v1/event_explorer/';
export const ROIEndpoint = '/api/tower-analytics/v1/roi_templates/';
export const plansEndpoint = '/api/tower-analytics/v1/plans/';
export const planEndpoint = '/api/tower-analytics/v1/plan/';

/* page options endpoints */
export const jobExplorerOptionsEndpoint = '/api/tower-analytics/v1/job_explorer_options/';
export const ROITemplatesOptionsEndpoint = '/api/tower-analytics/v1/roi_templates_options/';
export const orgOptionsEndpoint = '/api/tower-analytics/v1/dashboard_organization_statistics_options/';
export const clustersOptionsEndpoint = '/api/tower-analytics/v1/dashboard_clusters_options/';
export const planOptionsEndpoint = '/api/tower-analytics/v1/plan_options/';

const featuresEndpoint = '/api/featureflags/';

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

const authenticatedFetch = (endpoint: RequestInfo, options = {}) =>
  window.insights.chrome.auth
    .getUser()
    .then(() => fetch(endpoint, options));

export const getFeatures = async () => {
  try {
    const url = new URL(featuresEndpoint, window.location.origin);
    const response = await authenticatedFetch(url.toString());
    return response.ok ? response.json() : {};
  } catch (_error) {
    return {};
  }
};

export const preflightRequest = () =>
  authenticatedFetch(preflightEndpoint).then(handleResponse);

export interface ParamsWithPagination {
  limit?: string | number,
  offset?: string | number,
  sort_by?: string,
  [x: string]: string | number | undefined
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

export type Params = Record<string, string | number>;
export const post = (endpoint: string, params: Params = {}) => {
  const url = new URL(endpoint, window.location.origin);
  return authenticatedFetch(url.toString(), {
    method: 'POST',
    body: JSON.stringify(params),
  }).then(handleResponse);
};

export const get = (endpoint: string, params: Params = {}) => {
  const url = new URL(endpoint, window.location.origin);
  url.search = stringify(params);

  return authenticatedFetch(url.toString(), {
    method: 'GET'
  }).then(handleResponse);
}

/* Reading Data */
export const readJobExplorer = ({ params }: { params: ParamsWithPagination }) =>
  postWithPagination(jobExplorerEndpoint, params);

export const readEventExplorer = ({ params }: { params: ParamsWithPagination }) =>
  postWithPagination(eventExplorerEndpoint, params);

export const readROI = ({ params }: { params: ParamsWithPagination }) =>
  postWithPagination(ROIEndpoint, params);

export const readHostExplorer = ({ params }: { params: ParamsWithPagination }) =>
  postWithPagination(hostExplorerEndpoint, params);

export const readPlans = ({ params }: { params: ParamsWithPagination }) =>
  postWithPagination(plansEndpoint, params);
/* End of ReadingData */

/* Reading Options */
export const readClustersOptions = ({ params }: { params: Params }) => 
  post(clustersOptionsEndpoint, params);

export const readOrgOptions = ({ params }: { params: Params }) =>
  post(orgOptionsEndpoint, params);

export const readROIOptions = ({ params }: { params: Params }) =>
  post(ROITemplatesOptionsEndpoint, params);

export const readJobExplorerOptions = ({ params }: { params: Params }) =>
  post(jobExplorerOptionsEndpoint, params);

export const readPlanOptions = ({ params }: { params: Params } = { params: {} }) =>
  get(planOptionsEndpoint, params);
/* End of ReadingOptions */

export const createPlan = ({ params }: { params: Params }) => 
  post(planEndpoint, params);

export const readPlan = ({ params }: { params: Params }) =>
  post(plansEndpoint, params);

export const deletePlan = ({ params }: { params: { id: string, [x: string]: string}}) => {
  const url = new URL(`${planEndpoint}${params.id}/`, window.location.origin);
  return authenticatedFetch(url.toString(), {
    method: 'DELETE',
  }).then(handleResponse);
};

export const updatePlan = ({ id, params = {} }: { id: string, params: Params }) => {
  const url = new URL(`${planEndpoint}${id}/`, window.location.origin);
  return authenticatedFetch(url.toString(), {
    method: 'PUT',
    body: JSON.stringify(params),
  }).then(handleResponse);
};

// v0 endpoints used in Notifications.js
export const readClusters = () =>
  get(clustersEndpoint);

export const readNotifications = ({ params }: { params: Params }) =>
  get(notificationsEndpoint, params);
