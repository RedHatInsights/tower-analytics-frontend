import React from 'react';
import {
    Title,
    EmptyState,
    EmptyStateVariant,
    EmptyStateIcon
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';

const NoData = () => (
    <EmptyState variant={EmptyStateVariant.full}>
        <EmptyStateIcon icon={CubesIcon} />
        <Title headingLevel="h5" size="lg">
      No Data
        </Title>
    </EmptyState>
);

export default NoData;
