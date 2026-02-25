import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import pdfDownloadButton from './pdfDownloadButton';

const rootReducer = combineReducers({
  pdfDownloadButton,
});

const store = createStore(rootReducer, applyMiddleware(promiseMiddleware));

export type RootState = ReturnType<typeof store.getState>;
export type DispatchType = typeof store.dispatch;

export const useAppDispatch = (): DispatchType => useDispatch<DispatchType>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
