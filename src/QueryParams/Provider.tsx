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
  ActionItem,
  DispatchFunction,
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

  ///
  const [queue, setQueue] = useState<ActionItem<any>[]>([]);
  ///

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

  const update: UpdateFunction = ({ namespace = DEFAULT_NAMESPACE, fnc }) => {
    const newQueryParams = fnc(queryParams[namespace]);
    const q = {
      ...queryParams,
      [namespace]: newQueryParams,
    };

    setQsInUrl(q, history);
  };

  ///////////////////////////////////////////////////\

  const processNext = () => {
    if (queue.length > 0) {
      const a = queue[0];

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { namespace, action, props } = a;
      const fnc = action(props);
      update({ namespace, fnc });

      setQueue((prev) => prev.slice(1));
    }
  };

  useEffect(() => {
    processNext();
  }, [queue]);

  const useDispatch: DispatchFunction = ({
    actionFnc,
    namespace = DEFAULT_NAMESPACE,
  }) => {
    return (action) => {
      console.log('adding action', action);
      setQueue((curr) => [
        ...curr,
        { namespace, action: actionFnc, props: action },
      ]);
    };
  };

  ///////////////////////////////////////////////////

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
        update: useDispatch,
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
