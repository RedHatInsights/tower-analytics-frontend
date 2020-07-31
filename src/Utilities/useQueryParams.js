/*eslint camelcase: ["error", {properties: "never", ignoreDestructuring: true}]*/
/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "[iI]gnored" }]*/

import { useReducer } from 'react';
import moment from 'moment';

import { formatDate } from '../Utilities/helpers';

export const useQueryParams = initial => {
    const paramsReducer = (state, action) => {
        switch (action.type) {
            case 'SET_STARTDATE':
                return { ...state, startDate: action.startDate };
            case 'SET_ENDDATE':
                return { ...state, endDate: action.endDate };
            case 'SET_ID':
                if (!parseInt(action.id)) {
                    const { id: ignored, ...rest } = state;
                    return rest;
                }

                return { ...state, id: parseInt(action.id) };
            case 'SET_SORT_BY':
                if (action.sort === 'count:asc' || action.sort === 'count:desc') {
                    return { ...state, sort_by: action.sort };
                } else {
                    const { sort_by: ignored, ...rest } = state;
                    return rest;
                }

            case 'SET_LIMIT':
                if (!parseInt(action.limit)) {
                    const { limit: ignored, ...rest } = state;
                    return rest;
                }

                return { ...state, limit: parseInt(action.limit) };
            case 'SET_OFFSET':
                return { ...state, offset: action.offset };
            case 'SET_SEVERITY':
                if (action.severity.length <= 0) {
                    const { severity: ignored, ...rest } = state;
                    return rest;
                }

                return { ...state, severity: action.severity };
            case 'SET_ATTRIBUTES':
                return { ...state, attributes: [ ...action.attributes ]};
            case 'SET_JOB_TYPE':
                if (action.jobType.length <= 0) {
                    const { job_type: ignored, ...rest } = state;
                    return rest;
                }

                return { ...state, job_type: [ ...action.jobType ]};

            case 'SET_STATUS':
                if (action.status.length <= 0) {
                    const { status: ignored, ...rest } = state;
                    return rest;
                }

                return { ...state, status: [ ...action.status ]};
            case 'SET_ORG':
                if (action.org.length <= 0) {
                    const { org_id: ignored, ...rest } = state;
                    return rest;
                }

                return { ...state, org_id: [ ...action.org ]};
            case 'SET_CLUSTER':
                if (action.cluster.length <= 0) {
                    const { cluster_id: ignored, ...rest } = state;
                    return rest;
                }

                return { ...state, cluster_id: [ ...action.cluster ]};
            case 'SET_TEMPLATE':
                if (action.template.length <= 0) {
                    const { template_id: ignored, ...rest } = state;
                    return rest;
                }

                return { ...state, template_id: [ ...action.template ]};
            case 'SET_SORTBY':
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
                if (action.sortBy === null) {
=======
                if (action.sortBy.length <= 0) {
>>>>>>> Squashed commit of the following:
=======
                if (action.sortBy.length <= 0) {
>>>>>>> Squashed commit of the following:
=======
                if (action.sortBy === null) {
>>>>>>> Fix: sort by filter converted to select instead of multiselect
                    const { sort_by: ignored, ...rest } = state;
                    return rest;
                }

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
                return { ...state, sort_by: action.sortBy };
=======
                return { ...state, sort_by: [ ...action.sortBy ]};
>>>>>>> Squashed commit of the following:
=======
                return { ...state, sort_by: [ ...action.sortBy ]};
>>>>>>> Squashed commit of the following:
=======
                return { ...state, sort_by: action.sortBy };
>>>>>>> Fix: sort by filter converted to select instead of multiselect
            case 'SET_ROOT_WORKFLOWS_AND_JOBS':
                return { ...state, only_root_workflows_and_standalone_jobs: action.bool };
            case 'SET_QUICK_DATE_RANGE':
                if (action.quickDate === null) {
                    const { quick_date_range: ignored, ...rest } = state;
                    return rest;
                }

                return { ...state, quick_date_range: action.quickDate };
            case 'SET_START_DATE':
                if (action.date === null) {
                    const { start_date: ignored, ...rest } = state;
                    return rest;
                }

<<<<<<< HEAD
<<<<<<< HEAD
                return { ...state, start_date: formatDate(action.date) };
=======
                return { ...state, start_date: action.date };
>>>>>>> Squashed commit of the following:
=======
                return { ...state, start_date: action.date };
>>>>>>> Squashed commit of the following:
            case 'SET_END_DATE':
                if (action.date === null) {
                    const { end_date: ignored, ...rest } = state;
                    return rest;
                }

<<<<<<< HEAD
<<<<<<< HEAD
                return { ...state, end_date: formatDate(action.date) };
=======
                return { ...state, end_date: action.date };
>>>>>>> Squashed commit of the following:
=======
                return { ...state, end_date: action.date };
>>>>>>> Squashed commit of the following:
            default:
                throw new Error();
        }
    };

    const [ queryParams, dispatch ] = useReducer(paramsReducer, { ...initial });

    return {
        queryParams,
        dispatch,
        setEndDate: () => {
            const endDate = moment.utc().format('YYYY-MM-DD');
            dispatch({ type: 'SET_ENDDATE', endDate });
        },
        setId: id => dispatch({ type: 'SET_ID', id }),
        setStartDate: days => {
            let startDate;
            if (days === 7) {
                startDate = moment
                .utc()
                .subtract(1, 'week')
                .format('YYYY-MM-DD');
            }

            if (days === 14) {
                startDate = moment
                .utc()
                .subtract(2, 'weeks')
                .format('YYYY-MM-DD');
            }

            if (days === 31) {
                startDate = moment
                .utc()
                .subtract(1, 'month')
                .format('YYYY-MM-DD');
            } else {
                startDate = moment
                .utc()
                .subtract(days, 'days')
                .format('YYYY-MM-DD');
            }

            dispatch({ type: 'SET_STARTDATE', startDate });
        },
        setStartDateAsString: startDate => dispatch({ type: 'SET_STARTDATE', startDate }),
        setSortBy: sort => dispatch({ type: 'SET_SORT_BY', sort }),
        setLimit: limit => dispatch({ type: 'SET_LIMIT', limit }),
        setOffset: offset => dispatch({ type: 'SET_OFFSET', offset }),
        setSeverity: severity => dispatch({ type: 'SET_SEVERITY', severity }),
        setAttributes: attributes => dispatch({ type: 'SET_ATTRIBUTES', attributes }),
        setJobType: jobType => dispatch({ type: 'SET_JOB_TYPE', jobType }),
        setStatus: status => dispatch({ type: 'SET_STATUS', status }),
        setOrg: org => dispatch({ type: 'SET_ORG', org }),
        setCluster: cluster => dispatch({ type: 'SET_CLUSTER', cluster }),
        setTemplate: template => dispatch({ type: 'SET_TEMPLATE', template }),
        setSortBy2: sortBy => dispatch({ type: 'SET_SORTBY', sortBy }),
        setRootWorkflowsAndJobs: bool => dispatch({ type: 'SET_ROOT_WORKFLOWS_AND_JOBS', bool }),
        setQuickDateRange: quickDate => dispatch({ type: 'SET_QUICK_DATE_RANGE', quickDate }),
        setStart_Date: date => dispatch({ type: 'SET_START_DATE', date }),
        setEnd_Date: date => dispatch({ type: 'SET_END_DATE', date })
    };
};
