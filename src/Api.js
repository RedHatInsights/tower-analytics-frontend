import { stringify } from 'query-string';

const clustersEndpoint = `/api/tower-analytics/v0/clusters/`;
const notificationsEndPoint = `/api/tower-analytics/v0/notifications/`;
const preflightEndpoint = `/api/tower-analytics/v0/authorized/`;

const jobExplorerEndpoint = '/api/tower-analytics/v1/job_explorer/';
const jobExplorerOptionsEndpoint =
  '/api/tower-analytics/v1/job_explorer_options/';
const ROIEndpoint = '/api/tower-analytics/v1/roi_templates/';
const ROITemplatesOptionsEndpoint = '/api/tower-analytics/v1/roi_templates_options/';
const orgOptionsEndpoint = '/api/tower-analytics/v1/dashboard_organization_statistics_options/';
const hostExplorerEndpoint = '/api/tower-analytics/v1/host_explorer';
const clustersOptionsEndpoint = '/api/tower-analytics/v1/dashboard_clusters_options/';
const eventExplorerEndpoint = '/api/tower-analytics/v1/event_explorer/';

function getAbsoluteUrl() {
    const url = window.location.href;
    let arr = url.split('/');
    arr.pop();
    return arr.join('/');
}

function handleResponse(response) {
    return response.json().then(json => {
        if (response.ok) {
            return json;
        }

        if (response.status === 404 || response.status === 401) {
            return Promise.reject({
                status: response.status,
                message: json
            });
        } else {
            return Promise.reject(json);
        }
    });
}

export const preflightRequest = () => {
    return fetch(preflightEndpoint).then(handleResponse);
};

/* Section: Orgs page */
export const readOrgOptions = ({ params = {}}) => {
    let url = new URL(orgOptionsEndpoint, getAbsoluteUrl());
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(params)
    }).then(handleResponse);
};

export const readHostAcrossOrg = ({ params = {}}) => {
    const combined = {
        ...params,
        attributes: [ 'total_unique_host_count' ],
        group_by_time: true,
        group_by: 'org',
        sort_by: `host_task_count:${params.sort_by}`
    };

    let url = new URL(hostExplorerEndpoint, getAbsoluteUrl());
    url.search = stringify({
        limit: combined.limit,
        sort_by: combined.sort_by
    });

    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(combined)
    }).then(handleResponse);
};

export const readJobsByDateAndOrg = ({ params = {}}) => {
    const combined = {
        ...params,
        attributes: [ 'total_count' ],
        group_by_time: true,
        group_by: 'org',
        sort_by: `total_count:${params.sort_by}`
    };

    let url = new URL(jobExplorerEndpoint, getAbsoluteUrl());
    url.search = stringify({
        limit: combined.limit,
        sort_by: combined.sort_by
    });

    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(combined)
    }).then(handleResponse);
};

export const readJobRunsByOrg = ({ params = {}}) => {
    const combined = {
        ...params,
        group_by: 'org',
        include_others: true,
        attributes: [ 'host_count' ],
        sort_by: `total_count:${params.sort_by}`
    };

    let url = new URL(jobExplorerEndpoint, getAbsoluteUrl());
    url.search = stringify({
        limit: combined.limit,
        sort_by: combined.sort_by
    });

    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(combined)
    }).then(handleResponse);
};

export const readJobEventsByOrg = ({ params = {}}) => {
    const combined = {
        ...params,
        group_by: 'org',
        include_others: true,
        granularity: 'daily',
        attributes: [ 'host_task_count' ],
        sort_by: `host_task_count:${params.sort_by}`
    };

    let url = new URL(jobExplorerEndpoint, getAbsoluteUrl());
    url.search = stringify({
        limit: combined.limit,
        sort_by: combined.sort_by
    });

    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(combined)
    }).then(handleResponse);
};
/* End of section: Orgs page */

// used in Notifications.js
export const readClusters = () => {
    return fetch(clustersEndpoint).then(handleResponse);
};

export const readNotifications = ({ params = {}}) => {
    const formattedUrl = getAbsoluteUrl();
    let url = new URL(notificationsEndPoint, formattedUrl);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    return fetch(url).then(handleResponse);
};

export const readJobExplorerOptions = ({ params = {}}) => {
    const formattedUrl = getAbsoluteUrl();
    let url = new URL(jobExplorerOptionsEndpoint, formattedUrl);
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(params)
    }).then(handleResponse);
};

export const readClustersOptions = ({ params = {}}) => {
    const formattedUrl = getAbsoluteUrl();
    let url = new URL(clustersOptionsEndpoint, formattedUrl);
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(params)
    }).then(handleResponse);
};

export const readJobExplorer = ({ params = {}}) => {
    const { limit, offset, sort_by } = params;
    const paginationParams = {
        limit,
        offset,
        sort_by
    };
    const qs = stringify(paginationParams);
    const formattedUrl = getAbsoluteUrl();
    let url = new URL(jobExplorerEndpoint, formattedUrl);
    url.search = qs;
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(params)
    }).then(handleResponse);
};

export const readEventExplorer = ({ params = {}}) => {
    const { limit, offset, sort_by } = params;
    const paginationParams = {
        limit,
        offset,
        sort_by
    };
    const qs = stringify(paginationParams);
    const formattedUrl = getAbsoluteUrl();
    let url = new URL(eventExplorerEndpoint, formattedUrl);
    url.search = qs;
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(params)
    }).then(handleResponse);
};

export const readClustersBarChart = ({ params = {}}) => {
    const formattedUrl = getAbsoluteUrl();
    let url = new URL(jobExplorerEndpoint, formattedUrl);
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(params)
    }).then(handleResponse);
};

export const readROI = ({ params = {}}) => {
    const formattedUrl = getAbsoluteUrl();
    let url = new URL(ROIEndpoint, formattedUrl);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(params)
    }).then(handleResponse);
};

export const readROIOptions = ({ params = {}}) => {
    const formattedUrl = getAbsoluteUrl();
    let url = new URL(ROITemplatesOptionsEndpoint, formattedUrl);
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(params)
    }).then(handleResponse);
};
