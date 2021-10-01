import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { QueryParamsProvider as Provider } from './Context';
import {
  parseQueryParams,
  setQueryParams as setQsInUrl,
  DEFAULT_NAMESPACE,
} from './helpers';
import redirectWithQueryParams from './redirectWithQueryParams';

const QueryParamsProvider = ({ children }) => {
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

  const update = ({ newQueryParams, namespace = DEFAULT_NAMESPACE }) => {
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

QueryParamsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default QueryParamsProvider;
