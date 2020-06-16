/* eslint-disable camelcase */
/*eslint camelcase: ["error", {properties: "never", ignoreDestructuring: true}]*/
/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "[iI]gnored" }]*/
import { parse } from 'query-string';

export const formatQueryStrings = ({
    attributes,
    end_date,
    start_date,
    ids,
    limit,
    offset,
    job_type,
    status,
    org_id,
    cluster_id,
    template_id,
    sort_by
}) => {
    let strings = {};
    const parseAttrs = attrs => {
        return attrs
        .map(attr => {
            return `attributes=${encodeURIComponent(attr)}`;
        })
        .join('&');
    };

    const parseIds = ids => {
        return ids
        .map(id => {
            return encodeURIComponent(id);
        })
        .join('&');
    };

    const parseStatuses = statuses => {
        return statuses
        .map(status => {
            return `status=${encodeURIComponent(status)}`;
        })
        .join('&');
    };

    const parseJobType = jobTypes => {
        return jobTypes
        .map(jobType => {
            return `job_type=${encodeURIComponent(jobType)}`;
        })
        .join('&');
    };

    const parseOrganization = orgs => {
        return orgs
        .map(orgId => {
            return `org_id=${encodeURIComponent(orgId)}`;
        })
        .join('&');
    };

    const parseCluster = clusters => {
        return clusters
        .map(clusterId => {
            return `cluster_id=${encodeURIComponent(clusterId)}`;
        })
        .join('&');
    };

    const parseTemplate = templates => {
        return templates
        .map(templateId => {
            return `template_id=${encodeURIComponent(templateId)}`;
        })
        .join('&');
    };

    const parseSortBy = sortBy => {
        return sortBy
        .map(attr => {
            return `sort_by=${encodeURIComponent(attr)}`;
        })
        .join('&');
    };

    const parseStartDate = date => `start_date=${encodeURIComponent(date)}`;
    const parseEndDate = date => `end_date=${encodeURIComponent(date)}`;
    const parseLimit = limit => `limit=${encodeURIComponent(limit)}`;
    const parseOffset = offset => `offset=${encodeURIComponent(offset)}`;

    if (attributes) {
        strings.attributes = parseAttrs(attributes);
    }

    if (start_date) {
        strings.start_date = parseStartDate(start_date);
    }

    if (end_date) {
        strings.end_date = parseEndDate(end_date);
    }

    if (limit) {
        strings.limit = parseLimit(limit);
    }

    if (offset >= 0) {
        strings.offset = parseOffset(offset);
    }

    if (ids) {
        strings.ids = parseIds(ids);
    }

    if (job_type) {
        strings.jobType = parseJobType(job_type);
    }

    if (status) {
        strings.status = parseStatuses(status);
    }

    if (org_id) {
        strings.org_id = parseOrganization(org_id);
    }

    if (cluster_id) {
        strings.cluster_id = parseCluster(cluster_id);
    }

    if (template_id) {
        strings.template_id = parseTemplate(template_id);
    }

    if (sort_by) {
        strings.sort_by = parseSortBy(sort_by);
    }

    return {
        strings,
        stringify: strings => {
            return Object.keys(strings).map(key => strings[key]).join('&');
        },
        parse
    };

};
