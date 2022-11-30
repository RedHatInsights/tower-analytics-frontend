import React, { FunctionComponent } from 'react';
import {
  Title,
  EmptyState,
  EmptyStateVariant,
  EmptyStateIcon,
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';

interface Props {
  message?: string | Record<string, any> | never;
}

const NoData: FunctionComponent<Props> = ({ message }) => (
  <EmptyState variant={EmptyStateVariant.full} style={{ minHeight: '400px' }}>
    <EmptyStateIcon icon={CubesIcon} />
    {message === 'standby' ? (
      <Title headingLevel="h5" size="lg">
        Initial configuration in progress. Please try again in a few minutes.
      </Title>
    ) : (
      <Title headingLevel="h5" size="lg">
        No Data
      </Title>
    )}
  </EmptyState>
);

export default NoData;
