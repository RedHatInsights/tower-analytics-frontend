import { useContext, useEffect } from 'react';
import moment from 'moment';
import { QueryParamsContext } from './Context';
import useAsyncActionQueue from '../Utilities/useAsyncActionQueue';

import { formatDate } from '../Utilities/helpers';
import { DEFAULT_NAMESPACE } from './helpers';

const paramsReducer = (state, { type, value }) => {
  switch (type) {
    /* v0 api reducers */
    case 'SET_STARTDATE':
      return { ...state, startDate: value };
    case 'SET_ENDDATE':
      return { ...state, endDate: value };
    case 'SET_ID':
      if (isNaN(value)) {
        const { id: ignored, ...rest } = state;
        return rest;
      }

      return { ...state, id: +value };
    case 'SET_SEVERITY':
      if (value.severity === '') {
        const { severity: ignored, ...rest } = state;
        return rest;
      }

      return { ...state, ...value };

    /* v1 api reducers */
    /* Settings reducers START */
    /* TODO: Rip these two types of reducers apart from the others */
    /* It is doable for example by creating a different useParams hook */
    case 'SET_CHART_TYPE':
      return { ...state, chartType: value };
    case 'SET_CHART_SERIES_HIDDEN_PROPS':
      return { ...state, chartSeriesHiddenProps: value };
    /* Settings reducers END */
    case 'SET_LIMIT':
      return isNaN(value)
        ? { ...state, limit: '5' } // Defaults back to 5
        : { ...state, limit: value };
    case 'SET_OFFSET':
      return isNaN(value)
        ? { ...state, offset: '0' } // Defaults back to 0
        : { ...state, offset: value };
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
    case 'SET_MODULE':
    case 'SET_TEMPLATE':
    case 'SET_AUTOMATION_STATUS':
    case 'SET_CATEGORY':
    case 'SET_FREQUENCY':
    case 'SET_NAME':
    case 'SET_ROOT_WORKFLOWS_AND_JOBS':
    case 'SET_INVENTORY':
    case 'SET_SORT_OPTIONS':
    case 'SET_CALCULATOR':
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
    case 'SET_CALCULATOR_MANUAL':
      return {
        ...state,
        manual_cost: value,
      };
    case 'SET_CALCULATOR_AUTOMATION':
      return {
        ...state,
        automation_cost: value,
      };
    case 'SET_ENABLED_PER_ITEM':
      return {
        ...state,
        enabled_per_item: value,
      };
    case 'SET_TIME_PER_ITEM':
      return {
        ...state,
        time_per_item: value,
      };
    default:
      throw new Error(`The query params reducer action (${type}) not found.`);
  }
};

const actionMapper = {
  status: 'SET_STATUS',
  quick_date_range: 'SET_QUICK_DATE_RANGE',
  job_type: 'SET_JOB_TYPE',
  org_id: 'SET_ORG',
  cluster_id: 'SET_CLUSTER',
  task_action_id: 'SET_MODULE',
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
  manual_cost: 'SET_CALCULATOR_MANUAL',
  automation_cost: 'SET_CALCULATOR_AUTOMATION',
  enabled_per_item: 'SET_ENABLED_PER_ITEM',
  time_per_item: 'SET_TIME_PER_ITEM',
};

const useQueryParams = (initial, namespace = DEFAULT_NAMESPACE) => {
  const {
    queryParams,
    initialParams,
    update,
    addInitialParams,
    removeInitialParams,
  } = useContext(QueryParamsContext);

  /**
   * When first initializing the hook there may be no namespace for it
   * (before the first useEffect[]), so we pass the initial params passed
   * to the hook.
   *
   * If the initialProps are there already we use them until there is no qp
   * avaiable for the namespace.
   *
   * If we alreadt have the initialized namespace in the URL then we use it.
   */
  const params = queryParams[namespace] || initialParams[namespace] || initial;

  useEffect(() => {
    addInitialParams({ params: initial, namespace });

    return () => {
      removeInitialParams({ namespace });
    };
  }, []);

  const executeAction = (action) => {
    if (action.type === 'RESET_FILTER') {
      update({ newQueryParams: initial, namespace });
    } else {
      const newQueryParams = paramsReducer(params, action);
      update({ newQueryParams, namespace });
    }
  };

  /**
   * We need to use an action queue to ensure that the url updates
   * before the next action and we use the reducer on the lates
   * queryParams. Without this more than one dispatched action after each
   * other will update the url with the previous state.
   */
  const { push: dispatch } = useAsyncActionQueue({
    executeAction,
    waitFor: [params],
  });

  return {
    queryParams: params,
    dispatch,
    setFromToolbar: (varName, value = null) => {
      //reset pagination when filter is set
      dispatch({ type: 'SET_OFFSET', value: 0 });
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
    setFromTable: (varName, value) => {
      dispatch({ type: actionMapper[varName], value: value });
    },
    setFromCalculation: (varName, value) => {
      dispatch({ type: actionMapper[varName], value: value });
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

export default useQueryParams;
