/*eslint max-len: ["error", { "ignoreStrings": true }]*/

const barChartEndpoint = '/api/tower-analytics/chart30/';
const clustersEndpoint = '/api/tower-analytics/clusters/';
const groupedBarChartEndpoint = '/api/tower-analytics/jobs_by_date_and_org_30/';
const hostsEndpoint = '/api/tower-analytics/hosts_by_date_and_org/';
const modulesEndpoint = '/api/tower-analytics/modules/';
const notificationsEndPoint = '/api/tower-analytics/notifications/';
const pieChart1Endpoint = '/api/tower-analytics/job_runs_by_org_30/';
const pieChart2Endpoint = '/api/tower-analytics/job_events_by_org_30/';
const preflightEndpoint = '/api/tower-analytics/authorized/';
const templateJobsEndpoint = '/api/tower-analytics/template_jobs/';
const templatesEndPoint = '/api/tower-analytics/templates/';
const roiEndpoint = '/api/tower-analytics/roi_templates/';

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
    Object.keys(params).forEach(key =>
        url.searchParams.append(key, params[key])
    );
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
    Object.keys(params).forEach(key =>
        url.searchParams.append(key, params[key])
    );
    return fetch(url).then(handleResponse);
};

export const readJobsByDateAndOrg = ({ params = {}}) => {
    const formattedUrl = getAbsoluteUrl();
    let url = new URL(groupedBarChartEndpoint, formattedUrl);
    Object.keys(params).forEach(key =>
        url.searchParams.append(key, params[key])
    );
    return fetch(url).then(handleResponse);
};

export const readHostsByDateAndOrg = ({ params = {}}) => {
    const formattedUrl = getAbsoluteUrl();
    let url = new URL(hostsEndpoint, formattedUrl);
    Object.keys(params).forEach(key =>
        url.searchParams.append(key, params[key])
    );
    return fetch(url).then(handleResponse);
};

export const readModules = ({ params = {}}) => {
    const formattedUrl = getAbsoluteUrl();
    let url = new URL(modulesEndpoint, formattedUrl);
    Object.keys(params).forEach(key =>
        url.searchParams.append(key, params[key])
    );
    return fetch(url).then(handleResponse);
};

export const readTemplates = ({ params = {}}) => {
    const formattedUrl = getAbsoluteUrl();
    let url = new URL(templatesEndPoint, formattedUrl);
    Object.keys(params).forEach(key =>
        url.searchParams.append(key, params[key])
    );
    return fetch(url).then(handleResponse);
};

export const readNotifications = ({ params = {}}) => {
    const formattedUrl = getAbsoluteUrl();
    let url = new URL(notificationsEndPoint, formattedUrl);
    Object.keys(params).forEach(key =>
        url.searchParams.append(key, params[key])
    );
    return fetch(url).then(handleResponse);
};

export const readJobRunsByOrg = ({ params = {}}) => {
    const formattedUrl = getAbsoluteUrl();
    let url = new URL(pieChart1Endpoint, formattedUrl);
    Object.keys(params).forEach(key =>
        url.searchParams.append(key, params[key])
    );
    return fetch(url).then(handleResponse);
};

export const readJobEventsByOrg = ({ params = {}}) => {
    const formattedUrl = getAbsoluteUrl();
    let url = new URL(pieChart2Endpoint, formattedUrl);
    Object.keys(params).forEach(key =>
        url.searchParams.append(key, params[key])
    );
    return fetch(url).then(handleResponse);
};

export const readROI = ({ params = {}}) => {
    const formattedUrl = getAbsoluteUrl();
    let url = new URL(roiEndpoint, formattedUrl);
    Object.keys(params).forEach(key =>
        url.searchParams.append(key, params[key])
    );
    return fetch(url).then(handleResponse);
};
