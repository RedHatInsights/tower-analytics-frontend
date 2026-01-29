// @ts-nocheck
/**
 * Notifications Shim for PF6 Migration
 * =====================================
 *
 * The @redhat-cloud-services/frontend-components-notifications package changed
 * significantly in v6. The Redux-based API (/redux export) was removed.
 *
 * This shim provides placeholder implementations that log warnings but allow
 * the app to run. Notifications will not actually display until properly migrated.
 *
 * MIGRATION:
 * - Old: import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux'
 * - New: Use the store-based notifications API from frontend-components-notifications v6
 *
 * FILES USING THIS SHIM:
 * - src/Api/methods.ts
 * - src/store/index.ts
 * - src/Containers/Reports/Layouts/AutomationCalculator/AutomationCalculator.tsx
 *
 * @see https://github.com/RedHatInsights/frontend-components/tree/master/packages/notifications
 */

export const addNotification = (notification: any) => {
  console.warn('addNotification called but not implemented for PF6', notification);
  return { type: 'ADD_NOTIFICATION', payload: notification };
};

export const removeNotification = (id: string) => {
  console.warn('removeNotification called but not implemented for PF6', id);
  return { type: 'REMOVE_NOTIFICATION', payload: id };
};

export const notificationsReducer = (state = { notifications: [] }, action: any) => {
  console.warn('notificationsReducer called but not implemented for PF6');
  return state;
};
