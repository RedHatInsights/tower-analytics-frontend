import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Tooltip,
  ButtonVariant,
  Spinner,
  TooltipPosition,
} from '@patternfly/react-core';
import { DownloadIcon, ExclamationCircleIcon } from '@patternfly/react-icons';

import useRequest from '../../Utilities/useRequest';
import { useCallback } from 'react';
import { generatePdf } from '../../Api';
import AlertModal from "../AlertModal";
import ErrorDetail from "../ErrorDetail";

const DownloadPdfButton = ({ slug, data, y, label, xTickFormat }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const { error, isLoading, request } = useRequest(
    useCallback((data) =>
      generatePdf({
        slug,
        data,
        y,
        label,
        x_tick_format: xTickFormat,
      })
    ),
    null
  );

  const getPdfButtonText = (error) => {
    if (typeof error === 'string')
      return error;

    if (typeof error === 'object')
      return error?.error;

    return 'Download PDF version of report';
  }

  const toggleModal = async (isOpen) => {
    setIsModalOpen(isOpen);
    setIsOpen(false);
  };

  return (
    <Tooltip
      position={TooltipPosition.top}
      content={<div>{getPdfButtonText(error)}</div>}
    >
      <Button
        variant={error ? ButtonVariant.link : ButtonVariant.plain}
        aria-label={getPdfButtonText(error)}
        onClick={() => request(data)}
        isDanger={error}
      >
        {isLoading && <Spinner isSVG size="md" />}
        {!isLoading && error?.status === 404 && isOpen &&
          <AlertModal
            isOpen={!isModalOpen}
            title={'Error!'}
            onClose={() => {
              toggleModal(false);
            }}
          >
            <ErrorDetail error={error.error} />
          </AlertModal>
        }
        {!isLoading && error && <ExclamationCircleIcon />}
        {!isLoading && !error && <DownloadIcon />}
      </Button>
    </Tooltip>
  );
};

DownloadPdfButton.propTypes = {
  slug: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  y: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  xTickFormat: PropTypes.string.isRequired,
};

export default DownloadPdfButton;
