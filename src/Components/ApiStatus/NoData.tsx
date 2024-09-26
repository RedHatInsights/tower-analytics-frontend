import { EmptyStateFooter } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyState } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateVariant } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateIcon } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateBody } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateHeader } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import CubesIcon from '@patternfly/react-icons/dist/dynamic/icons/cubes-icon';
import React, { FunctionComponent } from 'react';

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
