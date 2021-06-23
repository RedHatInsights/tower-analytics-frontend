import React from 'react';
import PropTypes from 'prop-types';

import { Modal, Title } from '@patternfly/react-core';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InfoCircleIcon,
  TimesCircleIcon,
} from '@patternfly/react-icons';
import styled from 'styled-components';

const Header = styled.div`
  display: flex;
  svg {
    margin-right: 16px;
  }
`;

const AlertModal = ({
  isOpen = null,
  title,
  label,
  variant,
  children,
  ...props
}) => {
  const variantIcons = {
    danger: (
      <ExclamationCircleIcon
        size="lg"
        css="color: var(--pf-global--danger-color--100)"
      />
    ),
    error: (
      <TimesCircleIcon
        size="lg"
        css="color: var(--pf-global--danger-color--100)"
      />
    ),
    info: (
      <InfoCircleIcon
        size="lg"
        css="color: var(--pf-global--info-color--100)"
      />
    ),
    success: (
      <CheckCircleIcon
        size="lg"
        css="color: var(--pf-global--success-color--100)"
      />
    ),
    warning: (
      <ExclamationTriangleIcon
        size="lg"
        css="color: var(--pf-global--warning-color--100)"
      />
    ),
  };

  const customHeader = (
    <Header>
      {variant ? variantIcons[variant] : null}
      <Title id="alert-modal-header-label" size="2xl" headingLevel="h2">
        {title}
      </Title>
    </Header>
  );

  return (
    <Modal
      header={customHeader}
      aria-label={label || 'Alert modal'}
      aria-labelledby="alert-modal-header-label"
      isOpen={Boolean(isOpen)}
      variant="small"
      title={title}
      {...props}
    >
      {children}
    </Modal>
  );
};

AlertModal.propTypes = {
  isOpen: PropTypes.bool,
  title: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  variant: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default AlertModal;
