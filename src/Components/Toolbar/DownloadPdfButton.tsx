import React, { FC, useState } from 'react';
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

import { downloadPdf as downloadPdfAction } from '../../store/pdfDownloadButton/actions';
import { DownloadState } from '../../store/pdfDownloadButton/types';
import { Endpoint, OptionsReturnType, Params } from '../../Api';
import { useAppDispatch, useAppSelector } from '../../store';
import { useReadQueryParams } from '../../QueryParams';

interface Props {
  settingsNamespace: string;
  slug: string;
  endpointUrl: Endpoint;
  queryParams: Params;
  selectOptions: OptionsReturnType;
  y: string;
  label: string;
  xTickFormat: string;
  chartType: string;
  totalCount: number;
  onPageCount: number;
}

const DownloadPdfButton: FC<Props> = ({
  settingsNamespace = 'settings',
  slug,
  endpointUrl,
  queryParams,
  selectOptions,
  y,
  label,
  xTickFormat,
  chartType,
  totalCount,
  onPageCount,
}) => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isCurrent, setIsCurrent] = useState(true);
  const dispatch = useAppDispatch();
  const { chartSeriesHiddenProps } = useReadQueryParams(
    {
      chartSeriesHiddenProps: [],
    },
    settingsNamespace
  );

  const status = useAppSelector((state) => state?.pdfDownloadButton[slug]);
  const isLoading = status === DownloadState.pending;
  const isError = status === DownloadState.rejected;

  // This can change depending loading and error states
  const getPdfButtonText = 'Download PDF version of report';

  const downloadPdf = () => {
    // Don't allow user to span download button
    if (isLoading) return;

    // Dispatch the start of downloading the pdf
    dispatch(
      downloadPdfAction(
        {
          slug,
          schemaParams: {
            y,
            label,
            xTickFormat,
            chartType,
          },
          dataFetchingParams: {
            showExtraRows: !isCurrent,
            endpointUrl,
            queryParams,
            selectOptions,
            chartSeriesHiddenProps,
          },
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
          {totalCount <= onPageCount ? (
            <GridItem>All {totalCount} items</GridItem>
          ) : (
            <>
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
            </>
          )}
        </Grid>
      </Modal>
    </>
  );
};

export default DownloadPdfButton;
