import React, { FunctionComponent } from 'react';
import {
  Title,
  EmptyState,
  EmptyStateVariant,
  EmptyStateIcon,
  EmptyStateBody,
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';

const LoadingState: FunctionComponent<Record<string, never>> = () => (
  <EmptyState variant={EmptyStateVariant.full} style={{ minHeight: '400px' }}>
    <EmptyStateIcon icon={CubesIcon} />
    <Title headingLevel="h5" size="lg">
      Loading...
    </Title>
    <EmptyStateBody>Please wait.</EmptyStateBody>
  </EmptyState>
);

export default LoadingState;
