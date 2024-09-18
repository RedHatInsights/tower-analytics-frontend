import React, { FunctionComponent } from 'react';
import ApiErrorState from './ApiErrorState';
import LoadingState from './LoadingState';
import NoData from './NoData';

interface Props {
  api: {
    result: { meta: { count: number; tableData: [] } };
    error: {
      error: {
        error: string;
      };
    };
    isSuccess: boolean;
    isLoading: boolean;
  };
  children: React.ReactNode;
  customLoading?: boolean;
  customEmptyState?: boolean;
}

const ApiStatusWrapper: FunctionComponent<Props> = ({
  api,
  children,
  customLoading = false,
  customEmptyState = false,
}) => {
  if (customLoading && api.isLoading) {
    return <>{children}</>;
  }
  if (!api || api.isLoading)
    return <LoadingState data-cy={'api_loading_state'} />;
  if (api.error)
    return <ApiErrorState message={api.error.error.error || api.error.error} />;

  if (api.isSuccess) {
    if (
      api.result.meta.count === 0 &&
      !customEmptyState &&
      api.result.meta.tableData
    )
      return (
        <NoData
          title={'There is currently no data to display.'}
          subtext={'Select a template filter to see data.'}
        />
      );
    else if (api.result.meta.count === 0 && !customEmptyState)
      return <NoData />;
    return <>{children}</>;
  }

  return null;
};

export default ApiStatusWrapper;
