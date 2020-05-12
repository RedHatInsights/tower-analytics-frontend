/*eslint camelcase: ["error", {properties: "never", ignoreDestructuring: true}]*/
/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "[iI]gnored" }]*/
// import { useState, useEffect } from 'react';

export const formatQueryStrings = ({
    attributes = [],
    endDate = '',
    startDate = '',
    ids = [],
    limit = null,
    offset = null
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

    const parseStartDate = date => `startDate=${encodeURIComponent(date)}`;
    const parseEndDate = date => `endDate=${encodeURIComponent(date)}`;
    const parseLimit = limit => `limit=${encodeURIComponent(limit)}`;
    const parseOffset = offset => `offset=${encodeURIComponent(offset)}`;

    if (attributes) {
        strings.attributes = parseAttrs(attributes);
    }

    if (startDate) {
        strings.startDate = parseStartDate(startDate);
    }

    if (endDate) {
        strings.endDate = parseEndDate(endDate);
    }

    if (limit) {
        strings.limit = parseLimit(limit);
    }

    if (offset) {
        strings.offset = parseOffset(offset);
    }

    if (ids) {
        strings.ids = parseIds(ids);
    }

    return {
        strings
    };
};
