import React, { FunctionComponent } from 'react';
import {
  Button,
  Title,
  EmptyState,
  EmptyStateVariant,
  EmptyStateIcon,
  EmptyStateBody,
  ButtonVariant,
} from '@patternfly/react-core';
import { WrenchIcon } from '@patternfly/react-icons';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import NotAuthorized from '@redhat-cloud-services/frontend-components/NotAuthorized';
import { notAuthorizedParams } from '../../Utilities/constants';

interface Props {
  error: {
    status: number;
    // TODO; Get this later form the api file
    error: string | Record<string, any>;
  };
}

const AuthorizationErrorPage: FunctionComponent<Props> = ({ error }) => (
  <EmptyState variant={EmptyStateVariant.full} data-cy={'error_page'}>
    <EmptyStateIcon icon={WrenchIcon} />
    {error.status === 404 && (
      <>
        <Title headingLevel="h5" size="lg">
          No data found
        </Title>
        <EmptyStateBody>
          Please visit{' '}
          <a
            href="https://docs.ansible.com/automation-controller/latest/html/administration/usability_data_collection.html#automation-analytics"
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </a>{' '}
          to learn how to enable Automation Analytics.
        </EmptyStateBody>
      </>
    )}
    {error.status === 401 && (
      <>
        <Title headingLevel="h5" size="lg">
          Not authorized
        </Title>
        <EmptyStateBody>
          You do not have the correct permissions to view this page.
        </EmptyStateBody>
      </>
    )}
    {error.status === 403 && <NotAuthorized {...notAuthorizedParams} />}
    {!error.status && (
      <>
        <Title headingLevel="h5" size="lg">
          Something went wrong, please try reloading the page
        </Title>
        <Button
          variant={ButtonVariant.primary}
          onClick={() => window.location.reload()}
        >
          Reload
        </Button>
      </>
    )}
  </EmptyState>
);

export default AuthorizationErrorPage;
