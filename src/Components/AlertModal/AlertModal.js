import { Modal } from '@patternfly/react-core/dist/dynamic/components/Modal';
import { Title } from '@patternfly/react-core/dist/dynamic/components/Title';
import PFCheckCircleIcon from '@patternfly/react-icons/dist/dynamic/icons/check-circle-icon';
import PFExclamationCircleIcon from '@patternfly/react-icons/dist/dynamic/icons/exclamation-circle-icon';
import PFExclamationTriangleIcon from '@patternfly/react-icons/dist/dynamic/icons/exclamation-triangle-icon';
import PFInfoCircleIcon from '@patternfly/react-icons/dist/dynamic/icons/info-circle-icon';
import PFTimesCircleIcon from '@patternfly/react-icons/dist/dynamic/icons/times-circle-icon';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const ExclamationCircleIcon = styled(PFExclamationCircleIcon)`
  color: var(--pf-global--danger-color--100);
`;

const TimesCircleIcon = styled(PFTimesCircleIcon)`
  color: var(--pf-global--danger-color--100);
`;

const InfoCircleIcon = styled(PFInfoCircleIcon)`
  color: var(--pf-global--info-color--100);
`;

const CheckCircleIcon = styled(PFCheckCircleIcon)`
  color: var(--pf-global--success-color--100);
`;

const ExclamationTriangleIcon = styled(PFExclamationTriangleIcon)`
  color: var(--pf-global--warning-color--100);
`;

const Header = styled.div`
  display: flex;
  svg {
    margin-right: 16px;
  }
`;

const AlertModal = ({
  isOpen,
  title,
  label = 'Alert modal',
  variant = 'warning',
  children,
  ...props
}) => {
  const variantIcons = {
    danger: <ExclamationCircleIcon size='lg' />,
    error: <TimesCircleIcon size='lg' />,
    info: <InfoCircleIcon size='lg' />,
    success: <CheckCircleIcon size='lg' />,
    warning: <ExclamationTriangleIcon size='lg' />,
  };

  const customHeader = (
    <Header>
      {variant ? variantIcons[variant] : null}
      <Title id='alert-modal-header-label' size='2xl' headingLevel='h2'>
        {title}
      </Title>
    </Header>
  );

  return (
    <Modal
      header={customHeader}
      aria-label={label}
      aria-labelledby='alert-modal-header-label'
      isOpen={!!isOpen}
      variant='small'
      title={title}
      {...props}
    >
      {children}
    </Modal>
  );
};

AlertModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  label: PropTypes.string,
  variant: PropTypes.string,
  children: PropTypes.node,
};

export default AlertModal;
