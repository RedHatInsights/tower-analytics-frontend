import ReducerRegistry from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry';
import promiseMiddleware from 'redux-promise-middleware';
import downloadPdf from './ToastNotifications';
import notificationsMiddleware from '@redhat-cloud-services/frontend-components-notifications/notificationsMiddleware';
import { notificationsReducer } from '@redhat-cloud-services/frontend-components-notifications/redux';

let registry;
export const init = () => {
  if (!registry)
    registry = new ReducerRegistry({}, [
      promiseMiddleware,
      notificationsMiddleware({}),
    ]);

  registry.register({
    notifications: notificationsReducer,
    downloadPdf,
  });

  return registry.getStore();
};
