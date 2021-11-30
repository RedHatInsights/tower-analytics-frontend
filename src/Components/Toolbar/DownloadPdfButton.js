import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  ButtonVariant,
  Grid,
  GridItem,
  Modal,
  ModalVariant,
  Radio,
  Spinner,
  Tooltip,
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
  totalCount,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isCurrent, setIsCurrent] = useState(true);

  const { error, isLoading, request } = useRequest(
    () =>
      generatePdf({
        slug,
        endpointUrl,
        queryParams,
        y,
        label,
        x_tick_format: xTickFormat,
        showExtraRows: !isCurrent,
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
          onClick={() => setIsExportModalOpen(true)}
          isDanger={!!error}
        >
          {isLoading && <Spinner isSVG size="md" />}
          {!isLoading && error && <ExclamationCircleIcon />}
          {!isLoading && !error && <DownloadIcon />}
        </Button>
      </Tooltip>
      <Modal
        variant={ModalVariant.small}
        title="Export report"
        isOpen={isExportModalOpen}
        onClose={() => {
          setIsExportModalOpen(false);
        }}
        actions={[
          <Button
            key="export"
            variant={ButtonVariant.primary}
            onClick={() => {
              request();
              setIsExportModalOpen(false);
            }}
          >
            Export
          </Button>,
          <Button
            key="cancel"
            variant={ButtonVariant.link}
            onClick={() => setIsExportModalOpen(false)}
          >
            Cancel
          </Button>,
        ]}
      >
        <Grid md={4}>
          <GridItem>
            <Radio
              onChange={() => setIsCurrent(true)}
              isChecked={isCurrent}
              name="optionSelected"
              label="Current page"
              id="current-page-radio"
              aria-label="current-page-radio"
            />
          </GridItem>
          <GridItem>
            <Radio
              onChange={() => setIsCurrent(false)}
              isChecked={!isCurrent}
              name="optionSelected"
              label={
                totalCount <= 100
                  ? `All ${totalCount} items`
                  : `Top 100 of ${totalCount} items`
              }
              id="total-count-radio"
              aria-label="total-count-radio"
            />
          </GridItem>
        </Grid>
      </Modal>
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
  totalCount: PropTypes.number.isRequired,
};

export default DownloadPdfButton;
