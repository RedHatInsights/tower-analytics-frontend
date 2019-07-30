/* eslint-disable */

/*eslint max-len: ["error", { "ignoreStrings": true }]*/
const templatesEndpoint =
    'https://gist.githubusercontent.com/kialam/c27e05a4c29b560b8a116cd26caeea33/raw/81ea4ec69b9cd2685511d36c4cadf0fbdc32b66e/sample_template_info.json';

const templatesRequest = async (id) => {
    // id as param
    console.log('id', id);
    let response = await fetch(templatesEndpoint);
    let data = await response.json()
    return data;
};

export default templatesRequest;
