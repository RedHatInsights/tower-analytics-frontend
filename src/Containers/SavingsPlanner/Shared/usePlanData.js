import { useReducer } from 'react';
import { actions } from './constants';

const formatPayload = (data) => {
  data.tasks = data.tasks.map((task, index) => ({
    task,
    task_order: index + 1,
  }));

  if (!data.hosts || data.hosts === '') {
    data.hosts = 1;
  }

  // these two are fields the api expects but we don't
  // have form elements for in the MVP.
  data.hourly_rate = 50;
  data.frequency_per_period = 1;

  return data;
};

const convertTasks = (tasks = []) => {
  if (tasks?.length) {
    return tasks
      .sort((a, b) => a.task_order - b.task_order)
      .map(({ task }) => task);
  }
  return undefined;
};

const usePlanData = (initial) => {
  const formReducer = (state, { type, value }) => {
    switch (type) {
      /* v1 api reducers */
      case actions.SET_NAME:
        return {
          ...state,
          name: value,
        };
      case actions.SET_CATEGORY:
        return {
          ...state,
          category: value,
        };
      case actions.SET_DESCRIPTION:
        return {
          ...state,
          description: value,
        };
      case actions.SET_MANUAL_TIME:
        return {
          ...state,
          manual_time: value,
        };

      case actions.SET_HOSTS:
        return {
          ...state,
          hosts: value,
        };
      case actions.SET_FREQUENCY_PERIOD:
        return {
          ...state,
          frequency_period: value,
        };
      case actions.SET_TASKS:
        return {
          ...state,
          tasks: value,
        };
      case actions.SET_TEMPLATE_ID:
        return {
          ...state,
          template_id: value,
        };
      default:
        throw new Error(
          `usePlanData reducer action type ${type} was not found.`
        );
    }
  };

  const [formData, dispatch] = useReducer(formReducer, {
    name: initial?.name || '',
    category: initial?.category || 'system',
    description: initial?.description || '',
    manual_time: initial?.manual_time || 240,
    hosts: initial?.hosts || 1,
    frequency_period: initial?.frequency_period || 'weekly',
    tasks: convertTasks(initial?.tasks) || [],
    template_id: initial?.template_id || -2,
  });

  return {
    formData,
    requestPayload: formatPayload({ ...formData }),
    dispatch,
  };
};

export default usePlanData;
