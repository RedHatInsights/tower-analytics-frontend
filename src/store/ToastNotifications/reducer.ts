import { State, ActionTypes, ReducerTypes } from './types';

const initialState: State = [];

const reducer = (state = initialState, action: ActionTypes): State => {
  switch (action.type) {
    case ReducerTypes.pending:
      return [...state];
    // dispatch(addNotification(some payload, notificationId: 5))
    // return { ...state, notificationId: 5 }
    case ReducerTypes.rejected:
      return [...state];
    case ReducerTypes.fulfilled:
      return [...state];
    // dispatch(removeNotification(notificationId: 5))
    // return { ...state, notificationId: undefined }}
    default:
      return state;
  }
};

export default reducer;
