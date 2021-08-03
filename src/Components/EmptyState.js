import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Title,
  EmptyState,
  EmptyStateVariant,
  EmptyStateIcon,
  EmptyStateBody,
} from '@patternfly/react-core';
import { WrenchIcon } from '@patternfly/react-icons';
import NotAuthorized from '@redhat-cloud-services/frontend-components/NotAuthorized';
import { notAuthorizedParams } from '../Utilities/constants';

const DefaultEmptyState = ({ preflightError: error }) => (
  <EmptyState variant={EmptyStateVariant.full}>
    <EmptyStateIcon icon={WrenchIcon} />
    {error.status === 404 && (
      <>
        <Title headingLevel="h5" size="lg">
          No data found
        </Title>
        <EmptyStateBody>
          Please visit{' '}
          <a
            href="https://docs.ansible.com/ansible-tower/latest/html/administration/usability_data_collection.html#automation-analytics"
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
        <Button variant="primary" onClick={() => window.location.reload()}>
          Reload
        </Button>
      </>
    )}
  </EmptyState>
);

DefaultEmptyState.propTypes = {
  preflightError: PropTypes.object,
};

export default DefaultEmptyState;
