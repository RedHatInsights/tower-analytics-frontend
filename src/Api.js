import { stringify } from 'query-string';

const apiVersion = 'v0';
const barChartEndpoint = `/api/tower-analytics/${apiVersion}/chart30/`;
const clustersEndpoint = `/api/tower-analytics/${apiVersion}/clusters/`;
const modulesEndpoint = `/api/tower-analytics/${apiVersion}/modules/`;
const notificationsEndPoint = `/api/tower-analytics/${apiVersion}/notifications/`;
const preflightEndpoint = `/api/tower-analytics/${apiVersion}/authorized/`;
const templateJobsEndpoint = `/api/tower-analytics/${apiVersion}/template_jobs/`;
const templatesEndPoint = `/api/tower-analytics/${apiVersion}/templates/`;
const jobExplorerEndpoint = '/api/tower-analytics/v1/job_explorer/';
const jobExplorerOptionsEndpoint = '/api/tower-analytics/v1/job_explorer_options/';
const ROIEndpoint = '/api/tower-analytics/v1/roi_templates/';
const ROITemplatesOptionsEndpoint = '/api/tower-analytics/v1/roi_templates_options/';

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

export const readTemplateJobs = (id, { params = {}}) => {
    if (!id) {
        return;
    }

    const formattedUrl = getAbsoluteUrl();
    let url = new URL(templateJobsEndpoint + id + '/', formattedUrl);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    return fetch(url).then(handleResponse);
};

export const preflightRequest = () => {
    return fetch(preflightEndpoint).then(handleResponse);
};

export const readClusters = () => {
    return fetch(clustersEndpoint).then(handleResponse);
};

export const readChart30 = ({ params = {}}) => {
    const formattedUrl = getAbsoluteUrl();
    let url = new URL(barChartEndpoint, formattedUrl);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    return fetch(url).then(handleResponse);
};

export const readJobsByDateAndOrg = ({ params = {}}) => {
    const formattedUrl = getAbsoluteUrl();
    let url = new URL(jobExplorerEndpoint, formattedUrl);
    const { sort_by: ignored, ...rest } = params;
    Object.keys(rest).forEach(key => url.searchParams.append(key, rest[key]));
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            ...rest,
            group_by_time: true,
            group_by: 'org',
            sort_by: `id:desc`
        })
    }).then(handleResponse);
};

export const readJobRunsByOrg = ({ params = {}}) => {
    const formattedUrl = getAbsoluteUrl();
    let url = new URL(jobExplorerEndpoint, formattedUrl);
    const { sort_by, ...rest } = params;
    Object.keys(rest).forEach(key => url.searchParams.append(key, rest[key]));
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            ...rest,
            group_by: 'org',
            include_others: true,
            sort_by: `total_count:${sort_by}`
        })
    }).then(handleResponse);
};

export const readJobEventsByOrg = ({ params = {}}) => {
    const formattedUrl = getAbsoluteUrl();
    let url = new URL(jobExplorerEndpoint, formattedUrl);
    const { sort_by, ...rest } = params;
    Object.keys(rest).forEach(key => url.searchParams.append(key, rest[key]));
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            ...rest,
            group_by: 'org',
            include_others: true,
            sort_by: `host_task_count:${sort_by}` })
    }).then(handleResponse);
};

export const readModules = ({ params = {}}) => {
    const formattedUrl = getAbsoluteUrl();
    let url = new URL(modulesEndpoint, formattedUrl);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    return fetch(url).then(handleResponse);
};

export const readTemplates = ({ params = {}}) => {
    const formattedUrl = getAbsoluteUrl();
    let url = new URL(templatesEndPoint, formattedUrl);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    return fetch(url).then(handleResponse);
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
