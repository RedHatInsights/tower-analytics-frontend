export const actions = {
  SET_NAME: 'SET_NAME',
  SET_CATEGORY: 'SET_CATEGORY',
  SET_DESCRIPTION: 'SET_DESCRIPTION',
  SET_MANUAL_TIME: 'SET_MANUAL_TIME',
  SET_HOSTS: 'SET_HOSTS',
  SET_FREQUENCY_PERIOD: 'SET_FREQUENCY_PERIOD',
  SET_TASKS: 'SET_TASKS',
  SET_TEMPLATE_ID: 'SET_TEMPLATE_ID',
};

// Max length constraints for input validation (matching backend limits)
export const MAX_LENGTHS = {
  NAME: 255,
  DESCRIPTION: 1024,
  TASK: 255,
};
