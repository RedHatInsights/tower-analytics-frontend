import { useReducer } from 'react';
import moment from 'moment';

import { formatDate } from '../Utilities/helpers';

export const useQueryParams = (initial) => {
  const initialWithCalculatedParams = {
    ...initial,
    ...(initial.sort_options &&
      initial.sort_order && {
        sort_by: `${initial.sort_options}:${initial.sort_order}`,
      }),
  };

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
      case 'SET_SEVERITY':
        if (value.severity === '') {
          const { severity: ignored, ...rest } = state;
          return rest;
        }

        return { ...state, ...value };

      /* v1 api reducers */
      case 'SET_LIMIT':
        return isNaN(value)
          ? { ...state, limit: 5 } // Defaults back to 5
          : { ...state, limit: parseInt(value) };
      case 'SET_OFFSET':
        return isNaN(value)
          ? { ...state, offset: 0 } // Defaults back to 0
          : { ...state, offset: parseInt(value) };
      case 'SET_ATTRIBUTES':
      case 'SET_JOB_TYPE':
      case 'SET_STATUS':
      case 'SET_ORG':
      case 'SET_CLUSTER':
      case 'SET_TEMPLATE':
      case 'SET_AUTOMATION_STATUS':
      case 'SET_CATEGORY':
      case 'SET_FREQUENCY':
      case 'SET_NAME':
      case 'SET_ROOT_WORKFLOWS_AND_JOBS':
      case 'SET_INVENTORY':
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
        Object.entries(value).forEach(([key, value]) => {
          newValues[key] = formatDate(value);
        });
        return { ...state, ...newValues };
      }

      case 'SET_SORT_OPTIONS': {
        return {
          ...state,
          sort_options: value.sort_options,
          ...(state.sort_order && {
            sort_by: `${value.sort_options}:${state.sort_order}`,
          }), // Update sort by
        };
      }

      case 'SET_SORT_ORDER': {
        return {
          ...state,
          sort_order: value.sort_order,
          ...(state.sort_options && {
            sort_by: `${state.sort_options}:${value.sort_order}`,
          }), // Update sort by
        };
      }

      case 'REINITIALIZE':
        return { ...value };
      case 'RESET_FILTER':
        return { ...initialWithCalculatedParams };
      default:
        throw new Error(`The query params reducer action (${type}) not found.`);
    }
  };

  const [queryParams, dispatch] = useReducer(paramsReducer, {
    ...initialWithCalculatedParams,
  });

  const actionMapper = {
    status: 'SET_STATUS',
    quick_date_range: 'SET_QUICK_DATE_RANGE',
    job_type: 'SET_JOB_TYPE',
    org_id: 'SET_ORG',
    cluster_id: 'SET_CLUSTER',
    template_id: 'SET_TEMPLATE',
    sort_order: 'SET_SORT_ORDER',
    sort_options: `SET_SORT_OPTIONS`,
    start_date: 'SET_START_DATE',
    end_date: 'SET_END_DATE',
    automation_status: 'SET_AUTOMATION_STATUS',
    category: 'SET_CATEGORY',
    frequency_period: 'SET_FREQUENCY',
    name: 'SET_NAME',
    only_root_workflows_and_standalone_jobs: 'SET_ROOT_WORKFLOWS_AND_JOBS',
    inventory_id: 'SET_INVENTORY',
  };

  return {
    queryParams,
    dispatch,
    setFromToolbar: (varName, value = null) => {
      if (!varName) {
        dispatch({ type: 'RESET_FILTER' });
      } else {
        dispatch({ type: actionMapper[varName], value: { [varName]: value } });
      }
    },
    setFromPagination: (offset, limit = null) => {
      dispatch({ type: 'SET_OFFSET', value: offset });
      if (limit) {
        dispatch({ type: 'SET_LIMIT', value: limit });
      }
    },
    /* v0 api usage after this line */
    setSeverity: (severity) =>
      dispatch({ type: 'SET_SEVERITY', value: { severity } }),
    setEndDate: () => {
      const endDate = moment().format('YYYY-MM-DD');
      dispatch({ type: 'SET_ENDDATE', value: endDate });
    },
    setId: (value) => dispatch({ type: 'SET_ID', value }),
    setStartDate: (days) => {
      let startDate;
      if (days === 7) {
        startDate = moment().subtract(1, 'week').format('YYYY-MM-DD');
      }

      if (days === 14) {
        startDate = moment().subtract(2, 'weeks').format('YYYY-MM-DD');
      }

      if (days === 31) {
        startDate = moment().subtract(1, 'month').format('YYYY-MM-DD');
      } else {
        startDate = moment().subtract(days, 'days').format('YYYY-MM-DD');
      }

      dispatch({ type: 'SET_STARTDATE', value: startDate });
    },
    setStartDateAsString: (value) => dispatch({ type: 'SET_STARTDATE', value }),
  };
};
