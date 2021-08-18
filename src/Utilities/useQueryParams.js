import { useReducer } from 'react';
import moment from 'moment';
import { useHistory } from 'react-router-dom';

import { formatDate } from '../Utilities/helpers';
import { parseQueryString } from './qs';

export const useQueryParams = (initial) => {
  const history = useHistory();

  const initialWithCalculatedParams =
    history !== 'undefined' && history?.location
      ? parseQueryString(initial, history.location.search)
      : initial;
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
      case 'SET_GRANULARITY':
        switch (value.granularity) {
          case 'daily':
            return {
              ...state,
              ...value,
              quick_date_range: 'last_30_days',
            };
          case 'monthly':
            return {
              ...state,
              ...value,
              quick_date_range: 'last_6_months',
            };
          case 'yearly':
            return {
              ...state,
              ...value,
              quick_date_range: 'last_6_years',
            };
          default:
            return {
              ...state,
              granularity: 'daily',
              quick_date_range: 'last_30_days',
            };
        }
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
      case 'SET_SORT_OPTIONS':
      case 'SET_SORT_ORDER':
        return { ...state, ...value };
      case 'SET_QUICK_DATE_RANGE':
        return value !== 'custom'
          ? { ...state, ...value, start_date: null, end_date: null }
          : { ...state, ...value };
      case 'SET_START_DATE':
      case 'SET_END_DATE': {
        let newValues = {};
        Object.entries(value).forEach(([key, value]) => {
          newValues[key] = formatDate(value);
        });
        return { ...state, ...newValues };
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
    granularity: 'SET_GRANULARITY',
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
