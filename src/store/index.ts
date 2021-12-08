import { applyMiddleware, combineReducers, createStore, Dispatch } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import pdfDownloadButton, {
  ActionTypes as PdfDownloadActionTypes,
} from './pdfDownloadButton';
import {
  notificationsReducer,
  addNotification,
  removeNotification,
} from '@redhat-cloud-services/frontend-components-notifications/redux';

const rootReducer = combineReducers({
  notifications: notificationsReducer,
  pdfDownloadButton,
});

export type RootState = ReturnType<typeof rootReducer>;
export type ActionType =
  | PdfDownloadActionTypes
  | ReturnType<typeof addNotification>
  | ReturnType<typeof removeNotification>;
export type DispatchType = Dispatch<ActionType>;

const store = createStore(rootReducer, applyMiddleware(promiseMiddleware));

export default store;
