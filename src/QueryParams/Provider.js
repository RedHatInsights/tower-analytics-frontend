import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { Provider } from './Context';
import {
  parseQueryParams,
  setQueryParams as setQsInUrl,
  DEFAULT_NAMESPACE,
} from './helpers';

const QueryParamsProvider = ({ children }) => {
  const history = useHistory();

  const [queryParams, setQueryParams] = useState({});
  const [initialStates, setInitialStates] = useState({});

  useEffect(() => {
    const unlisten = history.listen((location) => {
      setQueryParams(parseQueryParams(location.search));
    });

    return () => {
      unlisten();
    };
  }, []);

  const update = ({ newQueryParams, namespace = DEFAULT_NAMESPACE }) => {
    setQsInUrl(namespace, newQueryParams, history);
  };

  const initialize = ({ newInitialStates, namespace = DEFAULT_NAMESPACE }) => {
    setInitialStates({
      ...initialStates,
      [namespace]: {
        ...newInitialStates,
      },
    });
  };

  const reset = ({ namespace = DEFAULT_NAMESPACE }) => {
    setQsInUrl(namespace, initialStates[namespace], history);
  };

  return (
    <Provider
      value={{
        queryParams,
        update,
        initialize,
        reset,
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
