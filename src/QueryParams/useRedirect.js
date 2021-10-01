import { useContext } from 'react';
import { QueryParamsContext } from './Context';

const useRedirect = () => {
  const { redirectWithQueryParams } = useContext(QueryParamsContext);

  return redirectWithQueryParams;
};

export default useRedirect;
