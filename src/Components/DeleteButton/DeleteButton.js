import React, { useState } from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import { Button, Badge, Alert, Tooltip } from '@patternfly/react-core';
import AlertModal from '../AlertModal';
import { getRelatedResourceDeleteCounts } from '../../Utilities/getRelatedResourceDeleteDetails';
import ErrorDetail from '../ErrorDetail';

const WarningMessage = styled(Alert)`
  margin-top: 10px;
`;
const Label = styled.span`
  && {
    margin-right: 10px;
  }
`;
function DeleteButton({
  onConfirm,
  modalTitle,
  name,
  variant,
  children,
  isDisabled,
  ouiaId,
  deleteMessage,
  deleteDetailsRequests,
  disabledTooltip,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteMessageError, setDeleteMessageError] = useState();
  const [deleteDetails, setDeleteDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const toggleModal = async isModalOpen => {
    setIsLoading(true);
    if (deleteDetailsRequests?.length && isModalOpen) {
      const { results, error } = await getRelatedResourceDeleteCounts(
        deleteDetailsRequests
      );
      if (error) {
        setDeleteMessageError(error);
      } else {
        setDeleteDetails(results);
      }
    }
    setIsLoading(false);
    setIsOpen(isModalOpen);
  };

  if (deleteMessageError) {
    return (
      <AlertModal
        isOpen={deleteMessageError}
        title={'Error!'}
        onClose={() => {
          toggleModal(false);
          setDeleteMessageError();
        }}
      >
        <ErrorDetail error={deleteMessageError} />
      </AlertModal>
    );
  }
  return (
    <>
      {disabledTooltip ? (
        <Tooltip content={disabledTooltip} position="top">
          <div>
            <Button
              spinnerAriaValueText={isLoading ? 'Loading' : undefined}
              variant={variant || 'secondary'}
              aria-label={'Delete'}
              isDisabled={isDisabled}
              onClick={() => toggleModal(true)}
              ouiaId={ouiaId}
            >
              {children || 'Delete'}
            </Button>
          </div>
        </Tooltip>
      ) : (
        <Button
          ouiaId={ouiaId}
          spinnerAriaValueText={isLoading ? 'Loading' : undefined}
          variant={variant || 'secondary'}
          aria-label={'Delete'}
          isDisabled={isDisabled}
          onClick={() => toggleModal(true)}
        >
          {children || 'Delete'}
        </Button>
      )}
      <AlertModal
        isOpen={isOpen}
        title={modalTitle}
        variant="danger"
        onClose={() => toggleModal(false)}
        actions={[
          <Button
            ouiaId="delete-modal-confirm"
            key="delete"
            variant="danger"
            aria-label={'Confirm Delete'}
            isDisabled={isDisabled}
            onClick={() => {
              onConfirm();
              toggleModal(false);
            }}
          >
            {'Delete'}
          </Button>,
          <Button
            ouiaId="delete-modal-cancel"
            key="cancel"
            variant="link"
            aria-label={'Cancel'}
            onClick={() => toggleModal(false)}
          >
            {'Cancel'}
          </Button>,
        ]}
      >
        {'Are you sure you want to delete:'}
        <br />
        <strong>{name}</strong>
        {Object.values(deleteDetails).length > 0 && (
          <WarningMessage
            variant="warning"
            isInline
            title={
              <div>
                <div aria-label={deleteMessage}>{deleteMessage}</div>
                <br />
                {Object.entries(deleteDetails).map(([key, value]) => (
                  <div aria-label={`${key}: ${value}`} key={key}>
                    <Label>{key}</Label> <Badge>{value}</Badge>
                  </div>
                ))}
              </div>
            }
          />
        )}
      </AlertModal>
    </>
  );
}

DeleteButton.propTypes = {
  ouiaId: PropTypes.string,
};

DeleteButton.defaultProps = {
  ouiaId: null,
};

export default DeleteButton;
