
import { EmptyState } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateVariant } from '@patternfly/react-core/dist/dynamic/components/EmptyState';

import { EmptyStateBody } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import SearchIcon from '@patternfly/react-icons/dist/dynamic/icons/search-icon';
import React, { FunctionComponent } from 'react';

const NoResults: FunctionComponent<Record<string, never>> = () => {
  return (
    <EmptyState  headingLevel='h4' icon={SearchIcon}  titleText='No results found' variant={EmptyStateVariant.full}>
      <EmptyStateBody>
        No results match the filter criteria. Remove all filters or clear all
        filters to show results.
      </EmptyStateBody>
    </EmptyState>
  );
};

export default NoResults;
