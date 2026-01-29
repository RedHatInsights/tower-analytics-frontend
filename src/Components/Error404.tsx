import { EmptyStateFooter } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyState } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateVariant } from '@patternfly/react-core/dist/dynamic/components/EmptyState';

import { EmptyStateBody } from '@patternfly/react-core/dist/dynamic/components/EmptyState';

import PathMissingIcon from '@patternfly/react-icons/dist/dynamic/icons/path-missing-icon';
import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { Paths } from '../paths';

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
  <EmptyState  headingLevel='h4' icon={PathMissingIcon}  titleText={<>{title}</>} variant={EmptyStateVariant.xl} data-cy={'error_page_404'}>
    <EmptyStateBody>{body}</EmptyStateBody>
    <EmptyStateFooter>
      <Link to={link.replace('/', '')}>{buttonText}</Link>
    </EmptyStateFooter>
  </EmptyState>
);
