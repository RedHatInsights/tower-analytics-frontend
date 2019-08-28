/*eslint max-len: ["error", { "ignoreStrings": true }]*/
import * as d3 from 'd3';

const barChartEndpoint = '/api/tower-analytics/chart30/';
const modulesEndpoint = '/api/tower-analytics/modules/';
const templatesEndPoint = '/api/tower-analytics/templates/';
const notificationsEndPoint = '/api/tower-analytics/notifications/';
const groupedBarChartEndpoint = '/api/tower-analytics/jobs_by_date_and_org_30/';
const donutChart1Endpoint =  '/api/tower-analytics/average_elapsed_time_by_org_30/';
const donutChart2Endpoint = '/api/tower-analytics/job_events_by_org_30/';

class D3Util {
    static async readJSON(endpoint) {
        return await d3.json(endpoint);
    }
    static async readCSV(endpoint) {
        return await d3.csv(endpoint);
    }
    static getBarChartData() {
        return this.readJSON(barChartEndpoint);
    }
    static getLineChartData() {
        return this.readJSON(barChartEndpoint);
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
    static getModulesData() {
        return this.readJSON(modulesEndpoint);
    }
    static getTemplatesData() {
        return this.readJSON(templatesEndPoint);
    }
    static getNotificationsData() {
        return this.readJSON(notificationsEndPoint);
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
