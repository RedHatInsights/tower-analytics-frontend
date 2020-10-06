/*eslint camelcase: ["error", {properties: "never", ignoreDestructuring: true}]*/
/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "[iI]gnored" }]*/

import { useReducer } from 'react';
import moment from 'moment';

import { formatDate } from '../Utilities/helpers';

export const useQueryParams = initial => {
    const paramsReducer = (state, action) => {
        switch (action.type) {
            case 'SET_STARTDATE':
                return { ...state, startDate: action.value };
            case 'SET_ENDDATE':
                return { ...state, endDate: action.value };
            case 'SET_ID':
                if (!parseInt(action.value)) {
                    const { id: ignored, ...rest } = state;
                    return rest;
                }

                return { ...state, id: parseInt(action.value) };
            case 'SET_SORT_BY':
                if (action.value === 'count:asc' || action.value === 'count:desc') {
                    return { ...state, sortBy: action.value };
                } else {
                    const { sortBy: ignored, ...rest } = state;
                    return rest;
                }

            case 'SET_LIMIT':
                if (!parseInt(action.value)) {
                    const { limit: ignored, ...rest } = state;
                    return rest;
                }

                return { ...state, limit: parseInt(action.value) };
            case 'SET_OFFSET':
                return { ...state, offset: action.value };
            case 'SET_SEVERITY':
                if (action.value.length <= 0) {
                    const { severity: ignored, ...rest } = state;
                    return rest;
                }

                return { ...state, severity: action.value };
            case 'SET_ATTRIBUTES':
                return { ...state, attributes: [ ...action.value ]};
            case 'SET_JOB_TYPE':
                if (action.value.length <= 0) {
                    const { jobType: ignored, ...rest } = state;
                    return rest;
                }

                return { ...state, jobType: [ ...action.value ]};

            case 'SET_STATUS':
                if (action.value.length <= 0) {
                    const { status: ignored, ...rest } = state;
                    return rest;
                }

                return { ...state, status: [ ...action.value ]};
            case 'SET_ORG':
                if (action.value.length <= 0) {
                    const { orgId: ignored, ...rest } = state;
                    return rest;
                }

                return { ...state, orgId: [ ...action.value ]};
            case 'SET_CLUSTER':
                if (action.value.length <= 0) {
                    const { clusterId: ignored, ...rest } = state;
                    return rest;
                }

                return { ...state, clusterId: [ ...action.value ]};
            case 'SET_TEMPLATE':
                if (action.value.length <= 0) {
                    const { templateId: ignored, ...rest } = state;
                    return rest;
                }

                return { ...state, templateId: [ ...action.value ]};
            case 'SET_SORTBY':
                if (action.value === null) {
                    const { sortBy: ignored, ...rest } = state;
                    return rest;
                }

                return { ...state, sortBy: action.value };
            case 'SET_ROOT_WORKFLOWS_AND_JOBS':
                return { ...state, onlyRootWorkflowsAndStandaloneJobs: action.value };
            case 'SET_QUICK_DATE_RANGE':
                if (action.value === null) {
                    const { quickDateRange: ignored, ...rest } = state;
                    return rest;
                } else {
                    let newState = { ...state };
                    if (action.value !== 'custom') {
                        newState = { ...newState, startDate: null, endDate: null };
                    }

                    newState = { ...newState, quickDateRange: action.value };
                    return newState;
                }

            case 'SET_START_DATE':
                if (action.value === null) {
                    const { startDate: ignored, ...rest } = state;
                    return rest;
                }

                return { ...state, startDate: formatDate(action.value) };
            case 'SET_END_DATE':
                if (action.value === null) {
                    const { endDate: ignored, ...rest } = state;
                    return rest;
                }

                return { ...state, endDate: formatDate(action.value) };
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
        setStartDateAsString: value => dispatch({ type: 'SET_STARTDATE', value }),
        setSortBy: value => dispatch({ type: 'SET_SORT_BY', value }),
        setLimit: value => dispatch({ type: 'SET_LIMIT', value }),
        setOffset: value => dispatch({ type: 'SET_OFFSET', value }),
        setSeverity: value => dispatch({ type: 'SET_SEVERITY', value }),
        setFromToolbar: (varName, value = null) => {
            if (!varName) {
                dispatch({ type: 'RESET', value: '' });
            } else {
                dispatch({ type: actionMapper[varName], value });
            }
        }
    };
};
