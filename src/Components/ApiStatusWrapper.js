import React from 'react';
import PropTypes from 'prop-types';
import ApiErrorState from './ApiErrorState';
import LoadingState from './LoadingState';
import NoData from './NoData';

const ApiStatusWrapper = ({ api, children }) => {
  if (api.isLoading) return <LoadingState />;
  if (api.error) return <ApiErrorState message={api.error.error} />;

  if (api.isSuccess) {
    if (Array.isArray(api.data) && api.data.length === 0) return <NoData />;
    if (Object.keys(api.data).length === 0) return <NoData />;
  }

  return children;
};

ApiStatusWrapper.propTypes = {
  api: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
};

export default ApiStatusWrapper;
