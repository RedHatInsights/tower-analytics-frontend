import { Alert } from '@patternfly/react-core/dist/dynamic/components/Alert';
import { Badge } from '@patternfly/react-core/dist/dynamic/components/Badge';
import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import { Tooltip } from '@patternfly/react-core/dist/dynamic/components/Tooltip';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styled from 'styled-components';
import { getRelatedResourceDeleteCounts } from '../../Utilities/getRelatedResourceDeleteDetails';
import AlertModal from '../AlertModal';
import ErrorDetail from '../ErrorDetail';

const WarningMessage = styled(Alert)`
  margin-top: 10px;
`;

const Label = styled.span`
  && {
    margin-right: 10px;
  }
`;

const DeleteButton = ({
  onConfirm,
  modalTitle = 'Delete',
  name = '',
  variant = 'secondary',
  isDisabled = false,
  ouiaId = null,
  deleteMessage = 'Delete?',
  deleteDetailsRequests = [],
  disabledTooltip = 'This item cannot be deleted',
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteMessageError, setDeleteMessageError] = useState();
  const [deleteDetails, setDeleteDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const toggleModal = async (isModalOpen) => {
    setIsLoading(true);
    if (deleteDetailsRequests.length > 0 && isModalOpen) {
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
        isOpen={!!deleteMessageError}
        variant={'error'}
        title={'Error!'}
        onClose={() => {
          toggleModal(false);
          setDeleteMessageError();
        }}
      >
        <ErrorDetail error={deleteMessageError.detail} />
      </AlertModal>
    );
  }

  return (
    <>
      {disabledTooltip ? (
        <Tooltip content={disabledTooltip} position='top'>
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
        variant='danger'
        onClose={() => toggleModal(false)}
        actions={[
          <Button
            ouiaId='delete-modal-confirm'
            key='delete'
            variant='danger'
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
            ouiaId='delete-modal-cancel'
            key='cancel'
            variant='link'
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
            variant='warning'
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
};

DeleteButton.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  modalTitle: PropTypes.string,
  name: PropTypes.string,
  variant: PropTypes.object,
  isDisabled: PropTypes.bool,
  ouiaId: PropTypes.string,
  deleteMessage: PropTypes.string,
  deleteDetailsRequests: PropTypes.array,
  disabledTooltip: PropTypes.bool,
  children: PropTypes.node,
};

export default DeleteButton;
