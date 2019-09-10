/*eslint max-len: ["error", { "ignoreStrings": true }]*/
const templatesEndpoint = '/api/tower-analytics/template_jobs/';
const clustersEndpoint = '/api/tower-analytics//clusters/';

export const templatesRequest = async (id) => {
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
