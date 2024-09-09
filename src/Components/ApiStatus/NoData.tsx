import React, { FunctionComponent } from 'react';
import {
  EmptyState,
  EmptyStateVariant,
  EmptyStateIcon,
  EmptyStateBody,
  EmptyStateHeader,
  EmptyStateFooter,
} from '@patternfly/react-core';
import CubesIcon from '@patternfly/react-icons/dist/esm/icons/cubes-icon';

interface Props {
  title?: string | Record<string, any>;
  subtext?: string | Record<string, any>;
}

const NoData: FunctionComponent<Props> = ({ title, subtext }) => (
  <EmptyState variant={EmptyStateVariant.full} style={{ minHeight: '400px' }}>
    <EmptyStateHeader
      titleText={<>{title ? title : 'No Data'}</>}
      icon={<EmptyStateIcon icon={CubesIcon} />}
      headingLevel='h5'
    />
    <EmptyStateFooter>
      {subtext && <EmptyStateBody>{subtext}</EmptyStateBody>}
    </EmptyStateFooter>
  </EmptyState>
);

export default NoData;
