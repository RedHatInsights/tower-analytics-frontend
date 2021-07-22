import React from 'react';
import PropTypes from 'prop-types';
import ApiErrorState from './ApiErrorState';
import LoadingState from './LoadingState';
import NoData from './NoData';

const ApiStatusWrapper = ({ api, children, apiError, apiIsSuccess, apiIsLoading }) => {
  if (!api || apiIsLoading) return <LoadingState />;
  if (apiError) return <ApiErrorState message={apiError.error} />;

  if (apiIsSuccess) {
    if (Array.isArray(api) && api.length === 0) return <NoData />;
    if (Object.keys(api).length === 0) return <NoData />;
    return children;
  }

  return '';
};

ApiStatusWrapper.propTypes = {
  api: PropTypes.object.isRequired,
  apiError: PropTypes.any.isRequired,
  apiIsSuccess: PropTypes.bool.isRequired,
  apiIsLoading: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

export default ApiStatusWrapper;
