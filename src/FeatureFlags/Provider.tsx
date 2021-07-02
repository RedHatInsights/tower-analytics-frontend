import React, { useState, useEffect, FunctionComponent } from 'react'
import { Provider } from './Context';
import { getFeatures } from '../Api';

interface Props {
  children: React.ReactNode
}

const FeatureFlagProvider: FunctionComponent<Props> = ({ children }) => {
  const [features, setFeatures] = useState({});

  useEffect(() => {
    getFeatures().then(flags => {
      setFeatures(flags);
      console.log(flags);
    });
  }, []);

  return (<Provider value={features}>{children}</Provider>);
};

export default FeatureFlagProvider;
