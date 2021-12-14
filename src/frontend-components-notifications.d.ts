// This file will be deprecated and should be removed once the library is typed

declare module '@redhat-cloud-services/frontend-components-notifications/redux' {
  export enum NotificationType {
    success = 'success',
    danger = 'danger',
    warning = 'warning',
    info = 'info',
  }

  export function notificationsReducer(state: any, action: any): any;

  export interface NotificationOptions {
    id?: string;
    title: string;
    variant: NotificationType;
    description?: string | React.ReactNode;
    dismissable?: boolean; // if is false, notification will not have the dismiss button,
    dismissDelay?: number; // time period after which alert disappears in ms. Default value is 8000
    autoDismiss?: boolean; // true by default, if set to false, notification will not automatically disapear after dismissDelay
  }

  export interface AddNotificationAction {
    type: string;
    payload: NotificationOptions;
  }

  export interface RemoveNotificationAction {
    type: string;
    payload: unknown;
  }

  export function addNotification(
    notification: NotificationOptions
  ): AddNotificationAction;
  export function removeNotification(id: string): RemoveNotificationAction;
}
