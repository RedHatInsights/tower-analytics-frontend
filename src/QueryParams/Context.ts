import { createContext } from 'react';
import { ContextProps } from './types';

export const QueryParamsContext = createContext<ContextProps>({
  queryParams: {},
  update: () => null,
  redirectWithQueryParams: () => null,
});
export const QueryParamsProvider = QueryParamsContext.Provider;
