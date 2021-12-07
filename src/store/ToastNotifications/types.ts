export enum DownloadState {
  pending,
  rejected,
}

export type State = Record<string, DownloadState>;

export enum ReducerTypes {
  pending = `TOAST_PENDING`,
  rejected = `TOAST_REJECTED`,
  toast = 'TOAST',
}

interface PendingAction {
  type: ReducerTypes.pending;
  meta: {
    slug: string;
  };
}

interface RejectedAction {
  type: ReducerTypes.rejected;
  meta: {
    slug: string;
  };
}

interface Toast {
  type: ReducerTypes.toast;
  payload: Promise<void>;
  meta: {
    slug: string;
  };
}

export type ActionTypes = Toast | PendingAction | RejectedAction;
