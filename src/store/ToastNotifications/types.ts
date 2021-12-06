import { ToastNotification } from '../../Api/types';

export type State = ToastNotification[];

export enum ReducerTypes {
  pending = `TOAST_PENDING`,
  rejected = `TOAST_REJECTED`,
  fulfilled = `TOAST_FULFILLED`,
  toast = 'TOAST',
}

interface PendingAction {
  type: ReducerTypes.pending;
}

interface RejectedAction {
  type: ReducerTypes.rejected;
}

interface FulfilledAction {
  type: ReducerTypes.fulfilled;
}

interface Toast {
  type: ReducerTypes.toast;
  payload: Promise<void>;
  meta: any;
}

export type ActionTypes =
  | Toast
  | PendingAction
  | RejectedAction
  | FulfilledAction;
