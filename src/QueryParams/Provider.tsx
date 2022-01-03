import React, { useState, useEffect, FunctionComponent } from 'react';
import { useHistory } from 'react-router-dom';
import { QueryParamsProvider as Provider } from './Context';
import {
  parseQueryParams,
  setQueryParams as setQsInUrl,
  DEFAULT_NAMESPACE,
} from './helpers';
import redirectWithQueryParams from './redirectWithQueryParams';
import { UpdateFunction } from './types';

interface Props {
  children: React.ReactNode;
}

const QueryParamsProvider: FunctionComponent<Props> = ({ children }) => {
  const history = useHistory();
  const [queryParams, setQueryParams] = useState({});

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

  return (
    <Provider
      value={{
        queryParams,
        update,
        redirectWithQueryParams: redirectWithQueryParams(history),
      }}
    >
      {children}
    </Provider>
  );
};

export default QueryParamsProvider;
