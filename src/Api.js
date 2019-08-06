/* eslint-disable */

/*eslint max-len: ["error", { "ignoreStrings": true }]*/
const templatesEndpoint = '/api/tower-analytics/template_jobs/';

const templatesRequest = async (id) => {
    // id as param
    console.log('id', id);
    let response = await fetch(templatesEndpoint + id + "/");
    let data = await response.json()
    return data;
};

export default templatesRequest;
