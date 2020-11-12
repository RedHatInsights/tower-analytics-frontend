/*eslint-disable max-len */
/*eslint max-len: ["error", { "ignoreTemplateLiterals": true }]*/
/*eslint max-len: ["error", { "ignoreStrings": true }]*/
import { stringify } from 'query-string';

const apiVersion = 'v0';
const barChartEndpoint = `/api/tower-analytics/${apiVersion}/chart30/`;
const clustersEndpoint = `/api/tower-analytics/${apiVersion}/clusters/`;
const groupedBarChartEndpoint = `/api/tower-analytics/${apiVersion}/jobs_by_date_and_org_30/`;
const modulesEndpoint = `/api/tower-analytics/${apiVersion}/modules/`;
const notificationsEndPoint = `/api/tower-analytics/${apiVersion}/notifications/`;
const pieChart1Endpoint = `/api/tower-analytics/${apiVersion}/job_runs_by_org_30/`;
const pieChart2Endpoint = `/api/tower-analytics/${apiVersion}/job_events_by_org_30/`;
const preflightEndpoint = `/api/tower-analytics/${apiVersion}/authorized/`;
const templateJobsEndpoint = `/api/tower-analytics/${apiVersion}/template_jobs/`;
const templatesEndPoint = `/api/tower-analytics/${apiVersion}/templates/`;
const roiEndpoint = `/api/tower-analytics/${apiVersion}/roi_templates/`;
const jobExplorerEndpoint = '/api/tower-analytics/v1/job_explorer/';
const jobExplorerOptionsEndpoint =
  '/api/tower-analytics/v1/job_explorer_options/';

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

export const readTemplateHostsStats = (id) => {
    if (!id) {
        return;
    }

    const params = {
        template_id: [ id ],
        attributes: [
            'host_count',
            'ok_host_count',
            'failed_host_count',
            'unreachable_host_count',
            'changed_host_count',
            'skipped_host_count',
            'elapsed',
            'job_type',
            'most_failed_tasks',
            'successful_count',
            'failed_count',
            'total_count',
            'average_elapsed_per_host',
            'host_task_count'
        ],
        group_by: 'template',
        job_type: [ 'job' ]
    };

    /*
    const paginationParams = {
        limit,
        offset,
        sort_by
    };
    */
    //const qs = stringify(paginationParams);
    const formattedUrl = getAbsoluteUrl();
    let url = new URL(jobExplorerEndpoint, formattedUrl);
    //url.search = qs;
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(params)
    }).then(handleResponse);

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
    let url = new URL(groupedBarChartEndpoint, formattedUrl);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    return fetch(url).then(handleResponse);
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

export const readJobRunsByOrg = ({ params = {}}) => {
    const formattedUrl = getAbsoluteUrl();
    let url = new URL(pieChart1Endpoint, formattedUrl);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    return fetch(url).then(handleResponse);
};

export const readJobEventsByOrg = ({ params = {}}) => {
    const formattedUrl = getAbsoluteUrl();
    let url = new URL(pieChart2Endpoint, formattedUrl);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    return fetch(url).then(handleResponse);
};

export const readROI = ({ params = {}}) => {
    const formattedUrl = getAbsoluteUrl();
    let url = new URL(roiEndpoint, formattedUrl);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    return fetch(url).then(handleResponse);
};
