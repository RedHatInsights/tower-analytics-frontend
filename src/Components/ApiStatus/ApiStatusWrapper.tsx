import React, { FunctionComponent } from 'react';
import { TempApiErrorType } from '../../Api';
import ApiErrorState from './ApiErrorState';
import LoadingState from './LoadingState';
import NoData from './NoData';

interface Props {
  api: {
    result: unknown;
    error: TempApiErrorType;
    isSuccess: boolean;
    isLoading: boolean;
  };
  children: React.ReactNode;
}

const ApiStatusWrapper: FunctionComponent<Props> = ({ api, children }) => {
  if (!api || api.isLoading) return <LoadingState />;
  if (api.error) return <ApiErrorState message={api.error.error} />;

  if (api.isSuccess) {
    if (Array.isArray(api.result) && api.result.length === 0) return <NoData />;
    if (Object.keys(api.result as Record<string, string>).length === 0)
      return <NoData />;
    return <>{children}</>;
  }

  return null;
};

export default ApiStatusWrapper;
