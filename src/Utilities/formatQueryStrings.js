/* eslint-disable camelcase */
/* eslint-disable */
/*eslint camelcase: ["error", {properties: "never", ignoreDestructuring: true}]*/
/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "[iI]gnored" }]*/
// import { useState, useEffect } from 'react';
import { parse } from 'query-string';

export const formatQueryStrings = ({
    attributes,
    end_date,
    start_date,
    ids,
    limit,
    offset,
    job_type,
    status
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

    const parseStartDate = date => `startDate=${encodeURIComponent(date)}`;
    const parseEndDate = date => `endDate=${encodeURIComponent(date)}`;
    const parseLimit = limit => `limit=${encodeURIComponent(limit)}`;
    const parseOffset = offset => `offset=${encodeURIComponent(offset)}`;
    // const parseJobType = jobType => `job_type=${encodeURIComponent(jobType)}`;

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

    return {
        strings,
        stringify: strings => {
            return Object.keys(strings).map(key => strings[key]).join('&');
        },
        parse
    }
        
};
