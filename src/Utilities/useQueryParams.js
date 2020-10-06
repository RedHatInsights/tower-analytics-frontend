/*eslint camelcase: ["error", {properties: "never", ignoreDestructuring: true}]*/
/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "[iI]gnored" }]*/

import { useReducer } from 'react';
import moment from 'moment';

import { formatDate } from '../Utilities/helpers';

export const useQueryParams = initial => {
    const paramsReducer = (state, { type, value }) => {
        switch (type) {
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
                if (!parseInt(value)) {
                    const { limit: ignored, ...rest } = state;
                    return rest;
                }

                return { ...state, limit: parseInt(value) };
            case 'SET_OFFSET':
                return { ...state, offset: value };
            case 'SET_SEVERITY':
                if (value.length <= 0) {
                    const { severity: ignored, ...rest } = state;
                    return rest;
                }

                return { ...state, severity: value };
            case 'SET_ATTRIBUTES':
                return { ...state, attributes: [ ...value ]};
            case 'SET_JOB_TYPE':
                if (value.length <= 0) {
                    const { jobType: ignored, ...rest } = state;
                    return rest;
                }

                return { ...state, jobType: [ ...value ]};

            case 'SET_STATUS':
                if (value.length <= 0) {
                    const { status: ignored, ...rest } = state;
                    return rest;
                }

                return { ...state, status: [ ...value ]};
            case 'SET_ORG':
                if (value.length <= 0) {
                    const { orgId: ignored, ...rest } = state;
                    return rest;
                }

                return { ...state, orgId: [ ...value ]};
            case 'SET_CLUSTER':
                if (value.length <= 0) {
                    const { clusterId: ignored, ...rest } = state;
                    return rest;
                }

                return { ...state, clusterId: [ ...value ]};
            case 'SET_TEMPLATE':
                if (value.length <= 0) {
                    const { templateId: ignored, ...rest } = state;
                    return rest;
                }

                return { ...state, templateId: [ ...value ]};
            case 'SET_SORTBY':
                if (value === null) {
                    const { sortBy: ignored, ...rest } = state;
                    return rest;
                }

                return { ...state, sortBy: value };
            case 'SET_ROOT_WORKFLOWS_AND_JOBS':
                return { ...state, onlyRootWorkflowsAndStandaloneJobs: value };
            case 'SET_QUICK_DATE_RANGE':
                if (value === null) {
                    const { quickDateRange: ignored, ...rest } = state;
                    return rest;
                } else {
                    let newState = { ...state };
                    if (value !== 'custom') {
                        newState = { ...newState, startDate: null, endDate: null };
                    }

                    newState = { ...newState, quickDateRange: value };
                    return newState;
                }

            case 'SET_START_DATE':
                if (value === null) {
                    const { startDate: ignored, ...rest } = state;
                    return rest;
                }

                return { ...state, startDate: formatDate(value) };
            case 'SET_END_DATE':
                if (value === null) {
                    const { endDate: ignored, ...rest } = state;
                    return rest;
                }

                return { ...state, endDate: formatDate(value) };
            case 'RESET':
                return { ...initial };
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
            urlFormatted[camelToSnakeCase(key)] = queryParams[key];
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
        setLimit: value => dispatch({ type: 'SET_LIMIT', value }),
        setOffset: value => dispatch({ type: 'SET_OFFSET', value }),
        setSeverity: value => dispatch({ type: 'SET_SEVERITY', value }),
        setFromToolbar: (varName, value = null) => {
            if (!varName) {
                dispatch({ type: 'RESET' });
            } else {
                dispatch({ type: actionMapper[varName], value });
            }
        },
        /* v0 api usage after this line */
        setEndDate: () => {
            const endDate = moment().format('YYYY-MM-DD');
            dispatch({ type: 'SET_ENDDATE', endDate });
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
