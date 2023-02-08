import React, { FunctionComponent } from 'react';
import {
  Title,
  EmptyState,
  EmptyStateVariant,
  EmptyStateIcon,
  EmptyStateBody,
  TitleSizes,
} from '@patternfly/react-core';
import PathMissingIcon from '@patternfly/react-icons/dist/js/icons/pathMissing-icon';
import { Paths } from '../paths';
import { Link } from 'react-router-dom';

interface Props {
  title?: string;
  body?: string;
  buttonText?: string;
  link?: string;
}

const Error404: FunctionComponent<Props> = ({
  title = '404: Page does not exist.',
  body = "Let's find you a new one.",
  buttonText = 'Return to home page',
  link = Paths.clusters,
}) => (
  <EmptyState variant={EmptyStateVariant.xl} data-cy={'error_page_404'}>
    <Title
      headingLevel="h4"
      size={TitleSizes['4xl']}
      style={{ padding: '2em' }}
    >
      {title}
    </Title>
    <EmptyStateIcon icon={PathMissingIcon} />
    <EmptyStateBody>{body}</EmptyStateBody>
    <Link to={link.replace('/', '')}>{buttonText}</Link>
  </EmptyState>
);

export default Error404;
