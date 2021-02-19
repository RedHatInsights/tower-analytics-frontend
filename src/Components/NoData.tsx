import React, { FunctionComponent } from 'react';
import {
    Title,
    EmptyState,
    EmptyStateVariant,
    EmptyStateIcon
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';

const NoData: FunctionComponent<Record<string, never>> = () => (
    <EmptyState variant={EmptyStateVariant.full}>
        <EmptyStateIcon icon={CubesIcon} />
        <Title headingLevel="h5" size="lg">
          No Data
        </Title>
    </EmptyState>
);

export default NoData;
