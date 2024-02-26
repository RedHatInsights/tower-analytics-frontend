import React, { FunctionComponent } from 'react';
import {
  EmptyState,
  EmptyStateVariant,
  EmptyStateIcon,
  EmptyStateBody, EmptyStateHeader,
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';

const LoadingState: FunctionComponent<Record<string, never>> = () => (
  <EmptyState variant={EmptyStateVariant.full} style={{ minHeight: '400px' }}>
    <EmptyStateHeader titleText="Loading..." icon={<EmptyStateIcon icon={CubesIcon} />} headingLevel="h5" />
    <EmptyStateBody>Please wait.</EmptyStateBody>
  </EmptyState>
);

export default LoadingState;
