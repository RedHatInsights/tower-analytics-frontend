import React from 'react';
import PropTypes from 'prop-types';
import ApiErrorState from './ApiErrorState';
import LoadingState from './LoadingState';
import NoData from './NoData';

const ApiStatusWrapper = ({ api, children }) => {
  if (!api || api.isLoading) return <LoadingState />;
  if (api.error) return <ApiErrorState message={api.error.error} />;

  if (api.isSuccess) {
    if (Array.isArray(api.result) && api.result.length === 0) return <NoData />;
    if (Object.keys(api.result).length === 0) return <NoData />;
    return children;
  }

  return '';
};

ApiStatusWrapper.propTypes = {
  api: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
};

export default ApiStatusWrapper;
