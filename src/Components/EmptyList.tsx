import React, { FunctionComponent } from 'react';
import {
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  Button,
  EmptyStateVariant,
  ButtonVariant,
  EmptyStateHeader,
  EmptyStateFooter,
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
  /* @ts-ignore */
  const navigate = useNavigate();

  return (
    <EmptyState variant={EmptyStateVariant.full}>
      <EmptyStateHeader
        titleText={<>{title}</>}
        icon={<EmptyStateIcon icon={canAdd ? AddCircleOIcon : SearchIcon} />}
        headingLevel='h3'
      />
      <EmptyStateBody>{message}</EmptyStateBody>
      <EmptyStateFooter>
        {(canAdd || showButton) && (
          <Button
            key='add-item-button'
            variant={ButtonVariant.primary}
            aria-label={label}
            onClick={() => {
              /* @ts-ignore */
              if (path) navigate(createUrl(path));
              if (onButtonClick) onButtonClick();
            }}
          >
            {label}
          </Button>
        )}
      </EmptyStateFooter>
    </EmptyState>
  );
};

export default EmptyList;
