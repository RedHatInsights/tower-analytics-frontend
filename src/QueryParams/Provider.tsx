import React, { useState, useEffect, FunctionComponent } from 'react';
import { useHistory } from 'react-router-dom';
import { QueryParamsProvider as Provider } from './Context';
import {
  parseQueryParams,
  setQueryParams as setQsInUrl,
  DEFAULT_NAMESPACE,
} from './helpers';
import redirectWithQueryParams from './redirectWithQueryParams';
import {
  InitialParamsFunction,
  NamespacedQueryParams,
  UpdateFunction,
} from './types';

interface Props {
  children: React.ReactNode;
}

const QueryParamsProvider: FunctionComponent<Props> = ({ children }) => {
  const history = useHistory();
  const [queryParams, setQueryParams] = useState<NamespacedQueryParams>({});
  const [initialParams, setInitialParams] = useState<NamespacedQueryParams>({});

  useEffect(() => {
    if (history.location.search.length > 0) {
      setQueryParams(parseQueryParams(location.search));
    }

    const unlisten = history.listen((location) => {
      setQueryParams(parseQueryParams(location.search));
    });

    return () => {
      unlisten();
    };
  }, []);

  const update: UpdateFunction = ({
    newQueryParams,
    namespace = DEFAULT_NAMESPACE,
  }) => {
    const q = {
      ...queryParams,
      [namespace]: newQueryParams,
    };

    setQsInUrl(q, history);
  };

  const addInitialParams: InitialParamsFunction = ({
    params,
    namespace = DEFAULT_NAMESPACE,
  }) => {
    setInitialParams({
      ...initialParams,
      [namespace]: {
        ...initialParams[namespace],
        ...params,
      },
    });
  };

  const removeInitialParams: InitialParamsFunction = ({
    params,
    namespace = DEFAULT_NAMESPACE,
  }) => {
    const newParams = { ...initialParams[namespace] };
    Object.keys(params).forEach((e) => delete newParams[e]);

    setInitialParams({
      ...initialParams,
      [namespace]: newParams,
    });
  };

  return (
    <Provider
      value={{
        queryParams,
        initialParams,
        update,
        addInitialParams,
        removeInitialParams,
        redirectWithQueryParams: redirectWithQueryParams(history),
      }}
    >
      {children}
    </Provider>
  );
};

export default QueryParamsProvider;
