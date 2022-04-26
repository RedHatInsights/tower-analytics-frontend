export enum DownloadState {
  pending,
  fulfilled,
  rejected,
}

export type State = Record<string, DownloadState>;

export enum ReducerTypes {
  pending = `PDF_DOWNLOAD_PENDING`,
  fulfilled = `PDF_DOWNLOAD_FULFILLED`,
  rejected = `PDF_DOWNLOAD_REJECTED`,
  act = 'PDF_DOWNLOAD',
}

interface PendingDownload {
  type: ReducerTypes.pending;
  meta: {
    slug: string;
  };
}

interface RejectedDownload {
  type: ReducerTypes.rejected;
  meta: {
    slug: string;
  };
}

interface FulfilledDownload {
  type: ReducerTypes.fulfilled;
  meta: {
    slug: string;
  };
}

interface Download {
  type: ReducerTypes.act;
  payload: Promise<void>;
  meta: {
    slug: string;
    token: string;
  };
}

export type ActionTypes =
  | Download
  | PendingDownload
  | FulfilledDownload
  | RejectedDownload;
