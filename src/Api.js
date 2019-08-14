/*eslint max-len: ["error", { "ignoreStrings": true }]*/
const templatesEndpoint = '/api/tower-analytics/template_jobs/';

const templatesRequest = async (id) => {
    if (!id) {
        return;
    }

    let response = await fetch(templatesEndpoint + id + '/');
    let data = await response.json();
    return data;
};

export default templatesRequest;
