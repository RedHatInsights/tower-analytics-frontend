import { useContext } from 'react';
import { QueryParamsContext } from './Context';
import { RedirectWithQueryParamsProps } from './types';

const useRedirect = (): RedirectWithQueryParamsProps => {
  const { redirectWithQueryParams } = useContext(QueryParamsContext);

  return redirectWithQueryParams;
};

export default useRedirect;
