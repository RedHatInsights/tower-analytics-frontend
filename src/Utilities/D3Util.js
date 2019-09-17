/*eslint max-len: ["error", { "ignoreStrings": true }]*/
import * as d3 from 'd3';

const barChartEndpoint = '/api/tower-analytics/chart30/';
const modulesEndpoint = '/api/tower-analytics/modules/';
const templatesEndPoint = '/api/tower-analytics/templates/';
const notificationsEndPoint = '/api/tower-analytics/notifications/';
const groupedBarChartEndpoint = '/api/tower-analytics/jobs_by_date_and_org_30/';
const donutChart1Endpoint =
  '/api/tower-analytics/job_runs_by_org_30/';
const donutChart2Endpoint = '/api/tower-analytics/job_events_by_org_30/';
class D3Util {
    static getAbsoluteUrl() {
        const url = window.location.href;
        let arr = url.split('/');
        arr.pop();
        return arr.join('/');
    }
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
    static getPieChart1Data({ params = {}}) {
        const formattedUrl = this.getAbsoluteUrl();
        let url = new URL(donutChart1Endpoint, formattedUrl);
        Object.keys(params).forEach(key =>
            url.searchParams.append(key, params[key])
        );
        return this.readJSON(url);
    }
    static getPieChart2Data({ params = {}}) {
        const formattedUrl = this.getAbsoluteUrl();
        let url = new URL(donutChart2Endpoint, formattedUrl);
        Object.keys(params).forEach(key =>
            url.searchParams.append(key, params[key])
        );
        return this.readJSON(url);
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
                total += parseInt(datum.count);
            });
            return total;
        }
    }
}

export default D3Util;
