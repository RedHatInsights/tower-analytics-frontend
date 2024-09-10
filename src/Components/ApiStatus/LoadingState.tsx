import { EmptyStateHeader } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyState } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateVariant } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateIcon } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateBody } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import CubesIcon from '@patternfly/react-icons/dist/dynamic/icons/cubes-icon';
import React, { FunctionComponent } from 'react';

const LoadingState: FunctionComponent<Record<string, never>> = () => (
  <EmptyState variant={EmptyStateVariant.full} style={{ minHeight: '400px' }}>
    <EmptyStateHeader
      titleText='Loading...'
      icon={<EmptyStateIcon icon={CubesIcon} />}
      headingLevel='h5'
    />
    <EmptyStateBody>Please wait.</EmptyStateBody>
  </EmptyState>
);

export default LoadingState;
