// @ts-nocheck
import { EmptyStateFooter } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyState } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateVariant } from '@patternfly/react-core/dist/dynamic/components/EmptyState';

import { EmptyStateBody } from '@patternfly/react-core/dist/dynamic/components/EmptyState';

import CubesIcon from '@patternfly/react-icons/dist/dynamic/icons/cubes-icon';
import React, { FunctionComponent } from 'react';

interface Props {
  title?: string | Record<string, any>;
  subtext?: string | Record<string, any>;
}

const NoData: FunctionComponent<Props> = ({ title, subtext }) => (
  <EmptyState  headingLevel='h5' icon={CubesIcon}  titleText={<>{title ? title : 'No Data'}</>} variant={EmptyStateVariant.full} style={{ minHeight: '400px' }}>
    <EmptyStateFooter>
      {subtext && <EmptyStateBody>{subtext}</EmptyStateBody>}
    </EmptyStateFooter>
  </EmptyState>
);

export default NoData;
