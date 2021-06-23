import React from 'react';
import PropTypes from 'prop-types';

import {
  Title,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  Button,
} from '@patternfly/react-core';
import { AddCircleOIcon } from '@patternfly/react-icons';
import { useHistory } from 'react-router-dom';

const EmptyList = ({
  label = '',
  title = 'No items found.',
  message = '',
  canAdd = false,
  path,
}) => {
  const history = useHistory();

  return (
    <EmptyState variant="full">
      <EmptyStateIcon icon={AddCircleOIcon} />
      <Title size="lg" headingLevel="h3">
        {title}
      </Title>
      <EmptyStateBody>{message}</EmptyStateBody>
      {canAdd && (
        <Button
          key="add-item-button"
          variant="primary"
          aria-label={label}
          onClick={() => {
            history.push({
              pathname: path,
            });
          }}
        >
          {label}
        </Button>
      )}
    </EmptyState>
  );
};

EmptyList.propTypes = {
  canAdd: PropTypes.bool,
  label: PropTypes.string,
  message: PropTypes.string,
  title: PropTypes.string,
  path: PropTypes.string.isRequired,
};

export default EmptyList;
