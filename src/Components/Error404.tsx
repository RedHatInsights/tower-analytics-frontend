import React, { FunctionComponent } from 'react';
import {
  Title,
  EmptyState,
  EmptyStateVariant,
  EmptyStateIcon,
  EmptyStateBody,
  TitleSizes,
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

const Error404: FunctionComponent<Props> = ({
  title = "404: We've lost it.",
  body = "Let's find you a new one.Try a new search or return home.",
  buttonText = 'Return to home page',
  link = Paths.clusters,
}) => (
  <EmptyState variant={EmptyStateVariant.xl}>
    <Title
      headingLevel="h4"
      size={TitleSizes['4xl']}
      style={{ padding: '2em' }}
    >
      {title}
    </Title>
    <EmptyStateIcon icon={PathMissingIcon} />
    <EmptyStateBody>{body}</EmptyStateBody>
    <Link to={link}>{buttonText}</Link>
  </EmptyState>
);

export default Error404;
