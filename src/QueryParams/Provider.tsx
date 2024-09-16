import React, { FunctionComponent, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QueryParamsProvider as Provider } from './Context';
import {
  DEFAULT_NAMESPACE,
  parseQueryParams,
  setQueryParams as setQsInUrl,
} from './helpers';
import { NamespacedQueryParams, UpdateFunction } from './types';

interface Props {
  children: React.ReactNode;
}

const QueryParamsProvider: FunctionComponent<Props> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [queryParams, setQueryParams] = useState<NamespacedQueryParams>({});

  useEffect(() => {
    if (location.search.length > 0) {
      setQueryParams(parseQueryParams(location.search));
    }
  }, []);

  useEffect(() => {
    setQueryParams(parseQueryParams(location.search));
  }, [location]);

  const update: UpdateFunction = ({
    newQueryParams,
    namespace = DEFAULT_NAMESPACE,
    removeDefault = false,
  }) => {
    const q = removeDefault
      ? {
          ...queryParams,
          [namespace]: newQueryParams,
          [DEFAULT_NAMESPACE]: {},
        }
      : {
          ...queryParams,
          [namespace]: newQueryParams,
        };

    setQsInUrl(q, navigate, location);
  };

  return (
    <Provider
      value={{
        queryParams,
        update,
      }}
    >
      {children}
    </Provider>
  );
};

export default QueryParamsProvider;
