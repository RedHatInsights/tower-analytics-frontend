import React, { FunctionComponent } from 'react';
import { Consumer } from './Context'

interface Props {
  name: string,
  children?: React.ReactNode,
  defaultChildren?: React.ReactNode
};

const FeatureFlag: FunctionComponent<Props> = ({ name: n, children, defaultChildren = null }) => (
  <Consumer>
    {features => {
      console.log(features);
      const feature = features.find(({ name }) => name === n);
      return (feature && feature.enabled)
        ? children
        : defaultChildren
    }}
  </Consumer>
);

export default FeatureFlag;
