import React, { FunctionComponent } from 'react';
import { Consumer } from './Context'

interface Props {
  name: string,
  children?: React.ReactNode,
  defaultChildren?: React.ReactNode
};

const FeatureFlag: FunctionComponent<Props> = ({ name, children, defaultChildren = null }) => (
  <Consumer>
    {features => 
      (features[name] && features[name].isEnabled)
        ? children
        : defaultChildren
    }
  </Consumer>
);

export default FeatureFlag;
