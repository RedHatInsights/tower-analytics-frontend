import React, { FunctionComponent } from 'react';
import ApiErrorState from './ApiErrorState';

interface Props {
  api: {
    result: unknown;
    error: { error: string | { error: string } } | null;
    isSuccess: boolean;
    isLoading: boolean;
  };
  children: React.ReactNode;
}

const ApiOptionsWrapper: FunctionComponent<Props> = ({ api, children }) => {
  if (api.error) {
    if (typeof api.error.error === 'object') {
      // The 404 error returns it one more time nested
      return <ApiErrorState message={api.error.error.error} />;
    } else {
      // TODO: I could not test this with real API, I left it as it was.
      return <ApiErrorState message={api.error.error} />;
    }
  }

  return <>{children}</>;
};

export default ApiOptionsWrapper;
