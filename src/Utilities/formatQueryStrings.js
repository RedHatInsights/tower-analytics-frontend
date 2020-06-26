/* eslint-disable camelcase */
/*eslint camelcase: ["error", {properties: "never", ignoreDestructuring: true}]*/
/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "[iI]gnored" }]*/
import { parse } from 'query-string';

export const formatQueryStrings = ({
    attributes,
    end_date,
    start_date,
    limit,
    offset,
    job_type,
    status,
    org_id,
    cluster_id,
    template_id,
    sort_by,
    only_root_workflows_and_standalone_jobs,
    quick_date_range
}) => {
    let strings = {};
    const parseAttrs = attrs => {
        if (Array.isArray(attrs)) {
            return attrs
            .map(attr => {
                return `attributes=${encodeURIComponent(attr)}`;
            })
            .join('&');
        } else {
            return `attributes=${encodeURIComponent(attrs)}`;
        }
    };

    const parseStatuses = statuses => {
        if (Array.isArray(statuses)) {
            return statuses
            .map(status => {
                return `status=${encodeURIComponent(status)}`;
            })
            .join('&');
        } else {
            return `status=${encodeURIComponent(statuses)}`;
        }
    };

    const parseJobType = jobTypes => {
        if (Array.isArray(jobTypes)) {
            return jobTypes
            .map(jobType => {
                return `job_type=${encodeURIComponent(jobType)}`;
            })
            .join('&');
        } else {
            return `job_type=${encodeURIComponent(jobTypes)}`;
        }
    };

    const parseOrganization = orgs => {
        if (Array.isArray(orgs)) {
            return orgs
            .map(orgId => {
                return `org_id=${encodeURIComponent(orgId)}`;
            })
            .join('&');
        } else {
            return `org_id=${orgs}`;
        }
    };

    const parseCluster = clusters => {
        if (Array.isArray(clusters)) {
            return clusters
            .map(clusterId => {
                return `cluster_id=${encodeURIComponent(clusterId)}`;
            })
            .join('&');
        } else {
            return `cluster_id=${encodeURIComponent(clusters)}`;
        }
    };

    const parseTemplate = templates => {
        if (Array.isArray(templates)) {
            return templates
            .map(templateId => {
                return `template_id=${encodeURIComponent(templateId)}`;
            })
            .join('&');
        } else {
            return `template_id=${encodeURIComponent(templates)}`;
        }
    };

    const parseSortBy = sortBy => {
        if (Array.isArray(sortBy)) {
            return sortBy
            .map(attr => {
                return `sort_by=${encodeURIComponent(attr)}`;
            })
            .join('&');
        } else {
            return `sort_by=${encodeURIComponent(sortBy)}`;
        }
    };

    const parseStartDate = date => `start_date=${encodeURIComponent(date)}`;
    const parseEndDate = date => `end_date=${encodeURIComponent(date)}`;
    const parseLimit = limit => `limit=${encodeURIComponent(limit)}`;
    const parseOffset = offset => `offset=${encodeURIComponent(offset)}`;

    const parseRootWorkflowsAndJobs = bool => `only_root_workflows_and_standalone_jobs=${encodeURIComponent(bool)}`;
    const parseQuickDateRange = quickDate => `quick_date_range=${encodeURIComponent(quickDate)}`;

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

    if (job_type) {
        strings.job_type = parseJobType(job_type);
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

    if (only_root_workflows_and_standalone_jobs !== undefined) {
        strings.only_root_workflows_and_standalone_jobs = parseRootWorkflowsAndJobs(only_root_workflows_and_standalone_jobs);
    }

    if (quick_date_range) {
        strings.quick_date_range = parseQuickDateRange(quick_date_range);
    }

    return {
        strings,
        stringify: strings => {
            return Object.keys(strings).map(key => strings[key]).join('&');
        },
        parse,
        parseStatuses,
        parseJobType,
        parseOrganization,
        parseCluster,
        parseTemplate,
        parseEndDate,
        parseStartDate,
        parseQuickDateRange,
        parseSortBy,
        parseAttrs,
        parseLimit,
        parseOffset,
        parseRootWorkflowsAndJobs
    };

};
