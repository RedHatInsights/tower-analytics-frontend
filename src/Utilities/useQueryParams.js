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
                    newState = { ...newState, start_date: '', end_date: '' };
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
                    quick_date_range: '',
                    job_type: [],
                    org_id: [],
                    cluster_id: [],
                    template_id: [],
                    sort_by: '',
                    start_date: '',
                    end_date: '',
                    only_root_workflow_and_standalone_jobs: false
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
        start_date: 'SET_START_DATE',
        end_date: 'SET_END_DATE',
        only_root_workflow_and_standalone_jobs: 'SET_ROOT_WORKFLOWS_AND_JOBS'
    };

    return {
        queryParams,
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
