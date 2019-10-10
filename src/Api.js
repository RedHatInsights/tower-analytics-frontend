/*eslint max-len: ["error", { "ignoreStrings": true }]*/
import moment from 'moment';

const barChartEndpoint = '/api/tower-analytics/chart30/';
const clustersEndpoint = '/api/tower-analytics/clusters/';
const groupedBarChartEndpoint = '/api/tower-analytics/jobs_by_date_and_org_30/';
const modulesEndpoint = '/api/tower-analytics/modules/';
const notificationsEndPoint = '/api/tower-analytics/notifications/';
const pieChart1Endpoint = '/api/tower-analytics/job_runs_by_org_30/';
const pieChart2Endpoint = '/api/tower-analytics/job_events_by_org_30/';
const preflightEndpoint = '/api/tower-analytics/authorized/';
const templateJobsEndpoint = '/api/tower-analytics/template_jobs/';
const templatesEndPoint = '/api/tower-analytics/templates/';

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

export const templatesRequest = async id => {
    if (!id) {
        return;
    }

    let response = await fetch(templateJobsEndpoint + id + '/');
    let data = await response.json();
    return data;
};

export const preflightRequest = () => {
    return fetch(preflightEndpoint).then(handleResponse);
};

export const readClusters = () => {
    return fetch(clustersEndpoint).then(handleResponse);
};

export const readChart30 = () => {
    return fetch(barChartEndpoint).then(handleResponse);
};

export const readChart30ById = ({ id = {}}) => {
    const { id: clusterId } = id;
    const formattedUrl = getAbsoluteUrl();
    let url = new URL(barChartEndpoint, formattedUrl);
    if (clusterId) {
        url.searchParams.append('id', clusterId);
    }

    return fetch(url).then(handleResponse);
};

export const readJobsByDateAndOrg = () => {
    return fetch(groupedBarChartEndpoint).then(handleResponse);
};

export const readModules = () => {
    return fetch(modulesEndpoint).then(handleResponse);
};

export const readTemplates = () => {
    return fetch(templatesEndPoint).then(handleResponse);
};

export const readNotifications = () => {
    return fetch(notificationsEndPoint).then(handleResponse);
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

export const getAllEndpoints = () => {
    const today = moment().format('YYYY-MM-DD');
    const previousDay = moment()
    .subtract(7, 'days')
    .format('YYYY-MM-DD');
    const defaultPrams = { params: { startDate: previousDay, endDate: today }};
    return Promise.all([
        readChart30(),
        readJobsByDateAndOrg(),
        readModules(),
        readTemplates(),
        readNotifications(),
        readClusters(),
        readJobRunsByOrg(defaultPrams),
        readJobEventsByOrg(defaultPrams)
    ]);
};
