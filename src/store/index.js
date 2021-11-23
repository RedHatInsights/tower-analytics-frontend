import ReducerRegistry from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry';
import promiseMiddleware from 'redux-promise-middleware';

import { notificationsReducer } from '@redhat-cloud-services/frontend-components-notifications/redux';

let registry;

export function init(...middleware) {
  if (!registry) {
    registry = new ReducerRegistry({}, [promiseMiddleware, ...middleware]);
  }
  registry.register({ notifications: notificationsReducer });
  return registry.getStore();
}
