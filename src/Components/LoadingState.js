import React from 'react';
import {
    Title,
    EmptyState,
    EmptyStateVariant,
    EmptyStateIcon,
    EmptyStateBody
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';

const DefaultLoadingState = () => (
    <EmptyState variant={ EmptyStateVariant.full }>
        <EmptyStateIcon icon={ CubesIcon } />
        <Title headingLevel="h5" size="lg">
            Loading...
        </Title>
        <EmptyStateBody>
            Please wait.
        </EmptyStateBody>
    </EmptyState>
);

export default DefaultLoadingState;
