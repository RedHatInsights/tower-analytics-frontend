
import { EmptyState } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateVariant } from '@patternfly/react-core/dist/dynamic/components/EmptyState';

import { EmptyStateBody } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import CubesIcon from '@patternfly/react-icons/dist/dynamic/icons/cubes-icon';
import React, { FunctionComponent } from 'react';

const LoadingState: FunctionComponent<Record<string, never>> = () => (
  <EmptyState  headingLevel='h5' icon={CubesIcon}  titleText='Loading...' variant={EmptyStateVariant.full} style={{ minHeight: '400px' }}>
    <EmptyStateBody>Please wait.</EmptyStateBody>
  </EmptyState>
);

export default LoadingState;
