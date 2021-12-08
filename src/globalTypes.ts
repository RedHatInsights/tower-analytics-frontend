export enum NotificationType {
  success = 'success',
  danger = 'danger',
  warning = 'warning',
  info = 'info',
}

export interface NotificationOptions {
  id?: string;
  title: string;
  variant: NotificationType;
  description?: string | React.ReactNode;
  dismissable?: boolean; // if is false, notification will not have the dismiss button,
  dismissDelay?: number; // time period after which alert disappears in ms. Default value is 8000
  autoDismiss?: boolean; // true by default, if set to false, notification will not automatically disapear after dismissDelay
}
