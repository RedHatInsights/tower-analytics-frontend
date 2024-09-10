import { ActionTypes, DownloadState, ReducerTypes, State } from './types';

const reducer = (state = {}, action: ActionTypes): State => {
  switch (action.type) {
    case ReducerTypes.pending:
      return {
        ...state,
        [action.meta.slug]: DownloadState.pending,
      };
    case ReducerTypes.fulfilled:
      return {
        ...state,
        [action.meta.slug]: DownloadState.fulfilled,
      };
    case ReducerTypes.rejected:
      return {
        ...state,
        [action.meta.slug]: DownloadState.rejected,
      };
    default:
      return { ...state };
  }
};

export default reducer;
