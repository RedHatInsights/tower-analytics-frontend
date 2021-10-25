import React, { useEffect, useState } from 'react';
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
import { generatePdf } from '../../Api';
import AlertModal from '../AlertModal';
import ErrorDetail from '../ErrorDetail';

const DownloadPdfButton = ({
  slug,
  endpointUrl,
  queryParams,
  y,
  label,
  xTickFormat,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { error, isLoading, request } = useRequest(
    () =>
      generatePdf({
        slug,
        endpointUrl,
        queryParams,
        y,
        label,
        x_tick_format: xTickFormat,
      }),
    null
  );

  const getErrorMessage = error?.error?.detail?.name;

  const getPdfButtonText =
    getErrorMessage?.at(0) ?? 'Download PDF version of report';

  useEffect(() => {
    if (error) {
      setIsModalOpen(true);
    }
  }, [error]);

  return (
    <>
      <Tooltip position={TooltipPosition.top} content={getPdfButtonText}>
        <Button
          variant={error ? ButtonVariant.link : ButtonVariant.plain}
          aria-label={getPdfButtonText}
          onClick={() => request()}
          isDanger={!!error}
        >
          {isLoading && <Spinner isSVG size="md" />}
          {!isLoading && error && <ExclamationCircleIcon />}
          {!isLoading && !error && <DownloadIcon />}
        </Button>
      </Tooltip>
      <AlertModal
        isOpen={isModalOpen}
        title={'PDF download error!'}
        onClose={() => {
          setIsModalOpen(false);
        }}
      >
        <ErrorDetail error={getErrorMessage} />
      </AlertModal>
    </>
  );
};

DownloadPdfButton.propTypes = {
  slug: PropTypes.string.isRequired,
  endpointUrl: PropTypes.string.isRequired,
  queryParams: PropTypes.object.isRequired,
  y: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  xTickFormat: PropTypes.string.isRequired,
};

export default DownloadPdfButton;
