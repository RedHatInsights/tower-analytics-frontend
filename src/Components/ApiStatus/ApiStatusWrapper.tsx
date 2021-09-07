import React, { FunctionComponent } from 'react';
import ApiErrorState from './ApiErrorState';
import LoadingState from './LoadingState';
import NoData from './NoData';
import NoResults from './NoResults';

interface Error404 {
  status: 404;
  error: { error: string };
}

interface ErrorOpenApiFormat {
  status: 422 | 401;
  error: { detail: { msg: string }[] };
}

// We are modifying the RBAC error in the api/methods
interface Error403 {
  status: 403;
  error: string;
}

type ErrorType = Error404 | ErrorOpenApiFormat | Error403;

interface Props {
  api: {
    result: unknown;
    error: ErrorType | null;
    isSuccess: boolean;
    isLoading: boolean;
  };
  children: React.ReactNode;
}

const ApiStatusWrapper: FunctionComponent<Props> = ({ api, children }) => {
  if (!api || api.isLoading) return <LoadingState />;
  if (api.error) {
    if (api.error.status === 404) {
      return (
        <ApiErrorState message={'The database has not been initialized yet'} />
      );
    } else if (api.error.status === 422) {
      return <ApiErrorState message={'Invalid data query'} />;
    } else if (api.error.status === 401) {
      return <ApiErrorState message={'Unauthorized'} />;
    } else if (api.error.status === 403) {
      return <ApiErrorState message={api.error.error} />;
    }
  }

  if (api.isSuccess) {
    // Logic when it should be no data and no results?
    if (!api.result) return <NoData />;
    if (Array.isArray(api.result) && api.result.length === 0)
      return <NoResults />;
    if (Object.keys(api.result as Record<string, string>).length === 0)
      return <NoData />;
    return <>{children}</>;
  }

  return null;
};

export default ApiStatusWrapper;
