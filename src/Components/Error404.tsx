import React, { FunctionComponent } from 'react';
import {
  EmptyState,
  EmptyStateVariant,
  EmptyStateIcon,
  EmptyStateBody,
  EmptyStateHeader, EmptyStateFooter,
} from '@patternfly/react-core';
import { PathMissingIcon } from '@patternfly/react-icons';
import { Paths } from '../paths';
import { Link } from 'react-router-dom';

interface Props {
  title?: string;
  body?: string;
  buttonText?: string;
  link?: string;
}

export const Error404: FunctionComponent<Props> = ({
  title = '404: Page does not exist.',
  body = "Let's find you a new one.",
  buttonText = 'Return to home page',
  link = Paths.clusters,
}) => (
  <EmptyState variant={EmptyStateVariant.xl} data-cy={'error_page_404'}>

    <EmptyStateHeader titleText={<>{title}</>} icon={<EmptyStateIcon icon={PathMissingIcon} />} headingLevel="h4" /><EmptyStateBody>{body}</EmptyStateBody><EmptyStateFooter>
    <Link to={link.replace('/', '')}>{buttonText}</Link>
  </EmptyStateFooter></EmptyState>
);
