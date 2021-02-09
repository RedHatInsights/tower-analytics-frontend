import React from 'react';
import {
    Title,
    EmptyState,
    EmptyStateVariant,
    EmptyStateIcon,
    EmptyStateBody
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';

const NoResults = () => {
    return (
        <EmptyState variant={EmptyStateVariant.full}>
            <EmptyStateIcon icon={SearchIcon} />
            <Title size="lg" headingLevel="h4">
        No results found
            </Title>
            <EmptyStateBody>
        No results match the filter criteria. Remove all filters or clear all
        filters to show results.
            </EmptyStateBody>
        </EmptyState>
    );
};

export default NoResults;
