import React, { useState } from 'react';
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

import { useDispatch, useSelector } from 'react-redux';
import { toast } from '../../store/ToastNotifications/actions';
import { DownloadState } from '../../store/ToastNotifications/types';

const DownloadPdfButton = ({
  slug,
  endpointUrl,
  queryParams,
  y,
  label,
  xTickFormat,
  totalCount,
}) => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isCurrent, setIsCurrent] = useState(true);
  const dispatch = useDispatch();

  const status = useSelector((state) => state.downloadPdf?.slug);
  const isLoading = status === DownloadState.pending;
  const isError = status === DownloadState.rejected;

  // This can change depending loading and error states
  const getPdfButtonText = 'Download PDF version of report';

  const downloadPdf = () => {
    // Don't allow user to span download button
    if (isLoading) return;

    // Dispatch the start of downloading the pdf
    dispatch(
      toast(
        {
          slug,
          endpointUrl,
          queryParams,
          y,
          label,
          x_tick_format: xTickFormat,
          showExtraRows: !isCurrent,
        },
        dispatch,
        slug
      )
    );
  };
  return (
    <>
      <Tooltip position={TooltipPosition.top} content={getPdfButtonText}>
        <Button
          variant={isError ? ButtonVariant.link : ButtonVariant.plain}
          aria-label={getPdfButtonText}
          onClick={() => setIsExportModalOpen(true)}
          isDanger={isError}
        >
          {isLoading && <Spinner isSVG size="md" />}
          {!isLoading && isError && <ExclamationCircleIcon />}
          {!isLoading && !isError && <DownloadIcon />}
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
          <>
            <Button
              key="export"
              variant={ButtonVariant.primary}
              onClick={() => {
                setIsExportModalOpen(false);
                downloadPdf();
              }}
            >
              Export
            </Button>
          </>,
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
