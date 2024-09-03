import React, { FunctionComponent } from 'react';
import {
  Title,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  Button,
  EmptyStateVariant,
  ButtonVariant,
} from '@patternfly/react-core';
import AddCircleOIcon from '@patternfly/react-icons/dist/esm/icons/add-circle-o-icon';
import SearchIcon from '@patternfly/react-icons/dist/esm/icons/search-icon';
import { createUrl } from '../QueryParams/';
import { useNavigate } from 'react-router-dom';

interface Props {
  label?: string;
  title?: string;
  message?: string;
  canAdd?: boolean;
  showButton?: boolean;
  path?: string;
  onButtonClick?: () => null;
}

const EmptyList: FunctionComponent<Props> = ({
  label = '',
  title = 'No items found.',
  message = '',
  canAdd = false,
  showButton = false,
  path = undefined,
  onButtonClick = undefined,
}) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  /* @ts-ignore */
  const navigate = useNavigate();

  return (
    <EmptyState variant={EmptyStateVariant.full}>
      <EmptyStateIcon icon={canAdd ? AddCircleOIcon : SearchIcon} />
      <Title size="lg" headingLevel="h3">
        {title}
      </Title>
      <EmptyStateBody>{message}</EmptyStateBody>
      {(canAdd || showButton) && (
        <Button
          key="add-item-button"
          variant={ButtonVariant.primary}
          aria-label={label}
          onClick={() => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            /* @ts-ignore */
            if (path) navigate(createUrl(path));
            if (onButtonClick) onButtonClick();
          }}
        >
          {label}
        </Button>
      )}
    </EmptyState>
  );
};

export default EmptyList;
