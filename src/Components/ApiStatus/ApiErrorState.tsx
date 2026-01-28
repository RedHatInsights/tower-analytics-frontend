import { EmptyState } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateBody } from '@patternfly/react-core/dist/dynamic/components/EmptyState';


import { EmptyStateVariant } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/dynamic/icons/exclamation-circle-icon';

import React, { FunctionComponent } from 'react';

interface Props {
  message: string | Record<string, any>;
}

const ApiErrorState: FunctionComponent<Props> = ({ message }) => (
  <EmptyState  headingLevel='h2' icon={ExclamationCircleIcon}  titleText='Error' variant={EmptyStateVariant.sm} data-cy={'api_error_state'}>
    <EmptyStateBody>{message}</EmptyStateBody>
  </EmptyState>
);

export default ApiErrorState;
