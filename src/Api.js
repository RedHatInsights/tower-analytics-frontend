import { stringify } from 'query-string';
/* v0 endpoints */
const clustersEndpoint = `/api/tower-analytics/v0/clusters/`;
const notificationsEndpoint = `/api/tower-analytics/v0/notifications/`;
const preflightEndpoint = `/api/tower-analytics/v0/authorized/`;

/* v1 endpoints */
const jobExplorerEndpoint = '/api/tower-analytics/v1/job_explorer/';
const hostExplorerEndpoint = '/api/tower-analytics/v1/host_explorer/';
const eventExplorerEndpoint = '/api/tower-analytics/v1/event_explorer/';
const ROIEndpoint = '/api/tower-analytics/v1/roi_templates/';
const plansEndpoint = '/api/tower-analytics/v1/plans/';
const planEndpoint = '/api/tower-analytics/v1/plan/';

/* page options endpoints */
const jobExplorerOptionsEndpoint =
  '/api/tower-analytics/v1/job_explorer_options/';
const ROITemplatesOptionsEndpoint =
  '/api/tower-analytics/v1/roi_templates_options/';
const orgOptionsEndpoint =
  '/api/tower-analytics/v1/dashboard_organization_statistics_options/';
const clustersOptionsEndpoint =
  '/api/tower-analytics/v1/dashboard_clusters_options/';
const planOptionsEndpoint = '/api/tower-analytics/v1/plan_options/';

function handleResponse(response) {
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
}

function authenticatedFetch(endpoint, options) {
  return window.insights.chrome.auth
    .getUser()
    .then(() => fetch(endpoint, options));
}

export const preflightRequest = () => {
  return authenticatedFetch(preflightEndpoint).then(handleResponse);
};

export const readJobExplorer = ({ params = {} }) => {
  const { limit, offset, sort_by } = params;
  const paginationParams = {
    limit,
    offset,
    sort_by,
  };
  const qs = stringify(paginationParams);
  let url = new URL(jobExplorerEndpoint, window.location.origin);
  url.search = qs;
  return authenticatedFetch(url, {
    method: 'POST',
    body: JSON.stringify(params),
  }).then(handleResponse);
};

export const readEventExplorer = ({ params = {} }) => {
  const { limit, offset, sort_by } = params;
  const paginationParams = {
    limit,
    offset,
    sort_by,
  };
  const qs = stringify(paginationParams);
  let url = new URL(eventExplorerEndpoint, window.location.origin);
  url.search = qs;
  return authenticatedFetch(url, {
    method: 'POST',
    body: JSON.stringify(params),
  }).then(handleResponse);
};

export const readROI = ({ params = {} }) => {
  const { limit, offset, sort_by } = params;
  const paginationParams = {
    limit,
    offset,
    sort_by,
  };
  const qs = stringify(paginationParams);
  let url = new URL(ROIEndpoint, window.location.origin);
  url.search = qs;
  return authenticatedFetch(url, {
    method: 'POST',
    body: JSON.stringify(params),
  }).then(handleResponse);
};

export const readHostExplorer = ({ params = {} }) => {
  const { limit, offset, sort_by } = params;
  const paginationParams = {
    limit,
    offset,
    sort_by,
  };
  const qs = stringify(paginationParams);
  let url = new URL(hostExplorerEndpoint, window.location.origin);
  url.search = qs;
  return authenticatedFetch(url, {
    method: 'POST',
    body: JSON.stringify(params),
  }).then(handleResponse);
};

export const readPlans = ({ params = {} }) => {
  const { limit, offset, sort_by } = params;
  const paginationParams = {
    limit,
    offset,
    sort_by,
  };
  const qs = stringify(paginationParams);
  let url = new URL(plansEndpoint, window.location.origin);
  url.search = qs;
  return authenticatedFetch(url, {
    method: 'POST',
    body: JSON.stringify(params),
  }).then(handleResponse);
};

export const createPlan = ({ params = {} }) => {
  let url = new URL(planEndpoint, window.location.origin);
  return authenticatedFetch(url, {
    method: 'POST',
    body: JSON.stringify(params),
  }).then(handleResponse);
};

export const deletePlan = ({ params = {} }) => {
  let url = new URL(`${planEndpoint}${params.id}/`, window.location.origin);
  return authenticatedFetch(url, {
    method: 'DELETE',
  }).then(handleResponse);
};

export const updatePlan = ({ id, params = {} }) => {
  let url = new URL(`${planEndpoint}${id}/`, window.location.origin);
  return authenticatedFetch(url, {
    method: 'PUT',
    body: JSON.stringify(params),
  }).then(handleResponse);
};

export const readPlan = ({ params = {} }) => {
  let url = new URL(plansEndpoint, window.location.origin);
  return authenticatedFetch(url, {
    method: 'POST',
    body: JSON.stringify(params),
  }).then(handleResponse);
};

export const readClustersOptions = ({ params = {} }) => {
  let url = new URL(clustersOptionsEndpoint, window.location.origin);
  return authenticatedFetch(url, {
    method: 'POST',
    body: JSON.stringify(params),
  }).then(handleResponse);
};

export const readOrgOptions = ({ params = {} }) => {
  let url = new URL(orgOptionsEndpoint, window.location.origin);
  return authenticatedFetch(url, {
    method: 'POST',
    body: JSON.stringify(params),
  }).then(handleResponse);
};

export const readROIOptions = ({ params = {} }) => {
  let url = new URL(ROITemplatesOptionsEndpoint, window.location.origin);
  return authenticatedFetch(url, {
    method: 'POST',
    body: JSON.stringify(params),
  }).then(handleResponse);
};

export const readPlanOptions = () => {
  let url = new URL(planOptionsEndpoint, window.location.origin);
  return authenticatedFetch(url, {
    method: 'GET',
  }).then(handleResponse);
};

// v0 endpoints used in Notifications.js
export const readClusters = () => {
  return authenticatedFetch(clustersEndpoint).then(handleResponse);
};

export const readNotifications = ({ params = {} }) => {
  let url = new URL(notificationsEndpoint, window.location.origin);
  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, params[key])
  );
  return authenticatedFetch(url).then(handleResponse);
};

export const readJobExplorerOptions = ({ params = {} }) => {
  let url = new URL(jobExplorerOptionsEndpoint, window.location.origin);
  return authenticatedFetch(url, {
    method: 'POST',
    body: JSON.stringify(params),
  }).then(handleResponse);
};
