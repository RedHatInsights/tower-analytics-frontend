/*eslint camelcase: ["error", {properties: "never", ignoreDestructuring: true}]*/
/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "[iI]gnored" }]*/

import { useReducer } from 'react';
import moment from 'moment';

import { formatDate } from '../Utilities/helpers';

export const useQueryParams = initial => {
    const paramsReducer = (state, { type, value }) => {
        switch (type) {
            /* v0 api reducers */
            case 'SET_STARTDATE':
                return { ...state, startDate: value };
            case 'SET_ENDDATE':
                return { ...state, endDate: value };
            case 'SET_ID':
                if (!parseInt(value)) {
                    const { id: ignored, ...rest } = state;
                    return rest;
                }

                return { ...state, id: parseInt(value) };
            case 'SET_LIMIT':
                if (!parseInt(value.limit)) {
                    const { limit: ignored, ...rest } = state;
                    return rest;
                }

                return { ...state, limit: parseInt(value.limit) };
            /* v1 api reducers */
            case 'SET_OFFSET':
            case 'SET_SEVERITY':
            case 'SET_ATTRIBUTES':
            case 'SET_JOB_TYPE':
            case 'SET_STATUS':
            case 'SET_ORG':
            case 'SET_CLUSTER':
            case 'SET_TEMPLATE':
            case 'SET_SORTBY':
            case 'SET_ROOT_WORKFLOWS_AND_JOBS':
                return { ...state, ...value };
            case 'SET_QUICK_DATE_RANGE': {
                let newState = { ...state };
                if (value !== 'custom') {
                    newState = { ...newState, startDate: null, endDate: null };
                }

                newState = { ...newState, ...value };
                return newState;
            }

            case 'SET_START_DATE':
            case 'SET_END_DATE': {
                let newValues = {};
                Object.entries(value).forEach(([ key, value ]) => {
                    newValues[key] = formatDate(value);
                });
                return { ...state, ...newValues };
            }

            case 'RESET_FILTER':
                return { ...state,
                    status: [],
                    quickDateRange: null,
                    jobType: [],
                    orgId: [],
                    clusterId: [],
                    templateId: [],
                    sortBy: null,
                    startDate: null,
                    endDate: null,
                    onlyRootWorkflowsAndStandaloneJobs: false
                };
            default:
                throw new Error();
        }
    };

    const [ queryParams, dispatch ] = useReducer(paramsReducer, { ...initial });

    /**
     * Converts queryParams object keys to snake case, which is accepted by the API
     */
    const urlMappedQueryParams = () => {
        const camelToSnakeCase = str => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        let urlFormatted = {};

        Object.keys(queryParams).forEach((key) => {
            // Filter out null and empty array elements
            if (queryParams[key]) {
                if (Array.isArray(queryParams[key])) {
                    if (queryParams[key].length < 1) {
                        return;
                    }
                }

                urlFormatted[camelToSnakeCase(key)] = queryParams[key];
            }
        });

        return urlFormatted;
    };

    const actionMapper = {
        status: 'SET_STATUS',
        quickDateRange: 'SET_QUICK_DATE_RANGE',
        jobType: 'SET_JOB_TYPE',
        orgId: 'SET_ORG',
        clusterId: 'SET_CLUSTER',
        templateId: 'SET_TEMPLATE',
        sortBy: 'SET_SORTBY',
        startDate: 'SET_START_DATE',
        endDate: 'SET_END_DATE',
        onlyRootWorkflowsAndStandaloneJobs: 'SET_ROOT_WORKFLOWS_AND_JOBS'
    };

    return {
        queryParams,
        urlMappedQueryParams: urlMappedQueryParams(),
        dispatch,
        setLimit: limit => dispatch({ type: 'SET_LIMIT', value: { limit }}),
        setOffset: offset => dispatch({ type: 'SET_OFFSET', value: { offset }}),
        setSeverity: severity => dispatch({ type: 'SET_SEVERITY', value: { severity }}),
        setFromToolbar: (varName, value = null) => {
            if (!varName) {
                dispatch({ type: 'RESET_FILTER' });
            } else {
                dispatch({ type: actionMapper[varName], value: { [varName]: value }});
            }
        },
        /* v0 api usage after this line */
        setEndDate: () => {
            const endDate = moment().format('YYYY-MM-DD');
            dispatch({ type: 'SET_ENDDATE', value: endDate });
        },
        setId: value => dispatch({ type: 'SET_ID', value }),
        setStartDate: days => {
            let startDate;
            if (days === 7) {
                startDate = moment()
                .subtract(1, 'week')
                .format('YYYY-MM-DD');
            }

            if (days === 14) {
                startDate = moment()
                .subtract(2, 'weeks')
                .format('YYYY-MM-DD');
            }

            if (days === 31) {
                startDate = moment()
                .subtract(1, 'month')
                .format('YYYY-MM-DD');
            } else {
                startDate = moment()
                .subtract(days, 'days')
                .format('YYYY-MM-DD');
            }

            dispatch({ type: 'SET_STARTDATE', value: startDate });
        },
        setStartDateAsString: value => dispatch({ type: 'SET_STARTDATE', value })
    };
};
