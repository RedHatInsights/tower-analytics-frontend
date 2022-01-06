import { createContext } from 'react';
import { ContextProps } from './types';

export const QueryParamsContext = createContext<ContextProps>({
  queryParams: {},
  initialParams: {},
  update: () => () => null,
  addInitialParams: () => null,
  removeInitialParams: () => null,
  redirectWithQueryParams: () => null,
});
export const QueryParamsProvider = QueryParamsContext.Provider;
