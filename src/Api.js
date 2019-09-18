/*eslint max-len: ["error", { "ignoreStrings": true }]*/
const templatesEndpoint = '/api/tower-analytics/template_jobs/';
const clustersEndpoint = '/api/tower-analytics/clusters/';
const preflightEndpoint = '/api/tower-analytics/authorized/';

export const templatesRequest = async id => {
    if (!id) {
        return;
    }

    let response = await fetch(templatesEndpoint + id + '/');
    let data = await response.json();
    return data;
};

export const clustersRequest = async () => {
    let response = await fetch(clustersEndpoint);
    let data = await response.json();
    return data;
};

export const preflightRequest = async () => {
    return fetch(preflightEndpoint).then(handleResponse);

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
};
