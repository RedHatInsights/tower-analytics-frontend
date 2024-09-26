import { EmptyState } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateBody } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateHeader } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateIcon } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateVariant } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/dynamic/icons/exclamation-circle-icon';
import { global_danger_color_200 as globalDangerColor200 } from '@patternfly/react-tokens';
import React, { FunctionComponent } from 'react';

interface Props {
  message: string | Record<string, any>;
}

const ApiErrorState: FunctionComponent<Props> = ({ message }) => (
  <EmptyState variant={EmptyStateVariant.sm} data-cy={'api_error_state'}>
    <EmptyStateHeader
      titleText='Error'
      icon={
        <EmptyStateIcon
          icon={ExclamationCircleIcon}
          color={globalDangerColor200.value}
        />
      }
      headingLevel='h2'
    />
    <EmptyStateBody>{message}</EmptyStateBody>
  </EmptyState>
);

export default ApiErrorState;
