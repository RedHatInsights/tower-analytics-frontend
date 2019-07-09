/*eslint max-len: ["error", { "ignoreStrings": true }]*/
import * as d3 from 'd3';

const barChartEndpoint = 'https://gist.githubusercontent.com/kialam/52130f7e3292dad03a0c841f39a3b9d3/raw/ce1496e22c103cfd04314bac98c67eb8f7b8a7a1/sample.csv';
const groupedBarChartEndpoint =
    'https://gist.githubusercontent.com/kialam/5d26af588b3f299a4589fc27d2be7ba3/raw/b21325b78b951968041a31a0e0ee061e4d8f40ff/groupedbarchartdata_large.json';
const donutChart1Endpoint =
    'https://gist.githubusercontent.com/kialam/fd0d1982a7aac0010c01a8f83741ff78/raw/5990e72318725bad39de4f977c58c26714f59379/donut_sample_1.json    ';
const donutChart2Endpoint =
    'https://gist.githubusercontent.com/kialam/78cc391eebe2b2b3dd19a859ca9061d8/raw/fbf6c07abc632415fad0e0e7e30649caddabccc2/donut_sample_2.json';

class D3Util {
    static async readJSON(endpoint) {
        return await d3.json(endpoint);
    }
    static async readCSV(endpoint) {
        return await d3.csv(endpoint);
    }
    static getBarChartData() {
        return this.readCSV(barChartEndpoint);
    }
    static getLineChartData() {
        return this.readCSV(barChartEndpoint);
    }
    static getGroupedChartData() {
        return this.readJSON(groupedBarChartEndpoint);
    }
    static getPieChart1Data() {
        return this.readJSON(donutChart1Endpoint);
    }
    static getPieChart2Data() {
        return this.readJSON(donutChart2Endpoint);
    }

    static getTotal(data) {
        if (!data) {
            return;
        } else {
            let total = 0;
            data.forEach(datum => {
                total += datum.count;
            });
            return total;
        }
    }
}

export default D3Util;
