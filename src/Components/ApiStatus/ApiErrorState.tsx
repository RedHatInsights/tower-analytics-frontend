import React, { FunctionComponent } from 'react';
import {
  EmptyState,
  EmptyStateBody,
  EmptyStateHeader,
  EmptyStateIcon,
  EmptyStateVariant,
  Title,
} from '@patternfly/react-core';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import { global_danger_color_200 as globalDangerColor200 } from '@patternfly/react-tokens';

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
