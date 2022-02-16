import React, { useState, useEffect, FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import { Provider } from './Context';
import { getFeatures } from '../Api/';
import { ApiFeatureFlagReturnType, FeatureFlagType } from './types';
import LoadingState from '../Components/ApiStatus/LoadingState';

interface Props {
  children: React.ReactNode;
}

const FeatureFlagProvider: FunctionComponent<Props> = ({ children }) => {
  const [features, setFeatures] = useState([] as FeatureFlagType[]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getFeatures()
      .then((flags: ApiFeatureFlagReturnType) => {
        if (flags && flags.toggles) {
          setFeatures(flags.toggles);
        } else {
          setFeatures([]);
        }
        setLoading(false);
      })
      .catch((error) =>
        console.error('Getting the feature flags resulted in error:', error)
      );
  }, []);

  if (loading || !features) {
    return <LoadingState />;
  } else {
    return <Provider value={features}>{children}</Provider>;
  }
};

FeatureFlagProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default FeatureFlagProvider;
