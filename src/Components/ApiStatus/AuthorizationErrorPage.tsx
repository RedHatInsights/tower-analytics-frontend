// @ts-ignore
import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import { ButtonVariant } from '@patternfly/react-core/dist/dynamic/components/Button';
import {
  EmptyState,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateHeader,
  EmptyStateIcon,
  EmptyStateVariant,
} from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { Title } from '@patternfly/react-core/dist/dynamic/components/Title';
import WrenchIcon from '@patternfly/react-icons/dist/dynamic/icons/wrench-icon';
import NotAuthorized from '@redhat-cloud-services/frontend-components/NotAuthorized';
import React, { FunctionComponent } from 'react';
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
    <EmptyStateHeader icon={<EmptyStateIcon icon={WrenchIcon} />} />
    <EmptyStateFooter>
      {error.status === 404 && (
        <>
          <Title headingLevel='h5' size='lg'>
            No data found
          </Title>
          <EmptyStateBody>
            Please visit{' '}
            <a
              href='https://docs.redhat.com/en/documentation/red_hat_ansible_automation_platform/2.5/html/configuring_automation_execution/controller-config#proc-controller-configure-analytics'
              target='_blank'
              rel='noopener noreferrer'
            >
              here
            </a>{' '}
            to learn how to enable Automation Analytics.
          </EmptyStateBody>
        </>
      )}
      {error.status === 401 && (
        <>
          <Title headingLevel='h5' size='lg'>
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
          <Title headingLevel='h5' size='lg'>
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
    </EmptyStateFooter>
  </EmptyState>
);

export default AuthorizationErrorPage;
