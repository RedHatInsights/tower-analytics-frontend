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
            case 'SET_SEVERITY':
                if (value.severity === '') {
                    const { severity: ignored, ...rest } = state;
                    return rest;
                }

                return { ...state, ...value };

                /* v1 api reducers */
            case 'SET_OFFSET':
            case 'SET_ATTRIBUTES':
            case 'SET_JOB_TYPE':
            case 'SET_STATUS':
            case 'SET_ORG':
            case 'SET_CLUSTER':
            case 'SET_TEMPLATE':
            case 'SET_SORTBY':
            case 'SET_SORTORDER':
            case 'SET_ROOT_WORKFLOWS_AND_JOBS':
                return { ...state, ...value };
            case 'SET_QUICK_DATE_RANGE': {
                let newState = { ...state };
                if (value !== 'custom') {
                    newState = { ...newState, start_date: null, end_date: null };
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

            case 'REINITIALIZE':
                return { ...value };
            case 'RESET_FILTER':
                return {
                    ...state,
                    ...initial
                };
            default:
                throw new Error();
        }
    };

    const [ queryParams, dispatch ] = useReducer(paramsReducer, { ...initial });

    const actionMapper = {
        status: 'SET_STATUS',
        quick_date_range: 'SET_QUICK_DATE_RANGE',
        job_type: 'SET_JOB_TYPE',
        org_id: 'SET_ORG',
        cluster_id: 'SET_CLUSTER',
        template_id: 'SET_TEMPLATE',
        sort_by: 'SET_SORTBY',
        sort_order: 'SET_SORTORDER',
        start_date: 'SET_START_DATE',
        end_date: 'SET_END_DATE',
        only_root_workflows_and_standalone_jobs: 'SET_ROOT_WORKFLOWS_AND_JOBS'
    };

    return {
        queryParams,
        dispatch,
        setLimit: limit => dispatch({ type: 'SET_LIMIT', value: { limit }}),
        setOffset: offset => dispatch({ type: 'SET_OFFSET', value: { offset }}),
        setFromToolbar: (varName, value = null) => {
            if (!varName) {
                dispatch({ type: 'RESET_FILTER' });
            } else {
                dispatch({ type: actionMapper[varName], value: { [varName]: value }});
            }
        },
        /* v0 api usage after this line */
        setSeverity: severity =>
            dispatch({ type: 'SET_SEVERITY', value: { severity }}),
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
