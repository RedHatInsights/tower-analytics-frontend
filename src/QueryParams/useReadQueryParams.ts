import { useContext } from 'react';
import { QueryParamsContext } from './Context';
import { DEFAULT_NAMESPACE } from './helpers';
import { QueryParams } from './types';

const useReadQueryParams = <T extends QueryParams>(
  initial: T,
  namespace = DEFAULT_NAMESPACE
): T => {
  const { queryParams, initialParams } = useContext(QueryParamsContext);

  return (
    (queryParams[namespace] as T) || (initialParams[namespace] as T) || initial
  );
};

export default useReadQueryParams;
