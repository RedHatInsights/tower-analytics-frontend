import React, { FunctionComponent } from 'react';
import ApiErrorState from './ApiErrorState';
import LoadingState from './LoadingState';
import NoData from './NoData';

interface Props {
  api: {
    result: { meta: { count: number } };
    error: { error: string; [key: string]: string } | null;
    isSuccess: boolean;
    isLoading: boolean;
  };
  children: React.ReactNode;
}

const ApiStatusWrapper: FunctionComponent<Props> = ({ api, children }) => {
  if (!api || api.isLoading) return <LoadingState />;
  if (api.error) return <ApiErrorState message={api.error.error} />;

  if (api.isSuccess) {
    if (api.result.meta.count === 0) return <NoData />;
    return <>{children}</>;
  }

  return null;
};

export default ApiStatusWrapper;
