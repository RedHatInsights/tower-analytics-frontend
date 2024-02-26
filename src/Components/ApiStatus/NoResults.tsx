import React, { FunctionComponent } from 'react';
import {
  EmptyState,
  EmptyStateVariant,
  EmptyStateIcon,
  EmptyStateBody, EmptyStateHeader,
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';

const NoResults: FunctionComponent<Record<string, never>> = () => {
  return (
    <EmptyState variant={EmptyStateVariant.full}>
      <EmptyStateHeader titleText="No results found" icon={<EmptyStateIcon icon={SearchIcon} />} headingLevel="h4" />
      <EmptyStateBody>
        No results match the filter criteria. Remove all filters or clear all
        filters to show results.
      </EmptyStateBody>
    </EmptyState>
  );
};

export default NoResults;
