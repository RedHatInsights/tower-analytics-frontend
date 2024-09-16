import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import { ButtonVariant } from '@patternfly/react-core/dist/dynamic/components/Button';
import { EmptyStateFooter } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyState } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateIcon } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateBody } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateVariant } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateHeader } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import AddCircleOIcon from '@patternfly/react-icons/dist/dynamic/icons/add-circle-o-icon';
import SearchIcon from '@patternfly/react-icons/dist/dynamic/icons/search-icon';
import React, { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUrl } from '../QueryParams/';

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
