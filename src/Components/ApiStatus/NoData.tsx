import React, { FunctionComponent } from 'react';
import {
  Title,
  EmptyState,
  EmptyStateVariant,
  EmptyStateIcon,
  EmptyStateBody,
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';

interface Props {
  title?: string | Record<string, any>;
  subtext?: string | Record<string, any>;
}

const NoData: FunctionComponent<Props> = ({ title, subtext }) => (
  <EmptyState variant={EmptyStateVariant.full} style={{ minHeight: '400px' }}>
    <EmptyStateIcon icon={CubesIcon} />
    <Title headingLevel="h5" size="lg">
      {title ? title : 'No Data'}
    </Title>
    {subtext && <EmptyStateBody>{subtext}</EmptyStateBody>}
  </EmptyState>
);

export default NoData;
