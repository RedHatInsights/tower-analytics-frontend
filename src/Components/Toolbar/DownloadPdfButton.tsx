import React, { FC, useEffect, useState } from 'react';
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
import { email as emailAction } from '../../store/pdfDownloadButton/actions';
import { DownloadState } from '../../store/pdfDownloadButton/types';
import {
  Endpoint,
  getRbacGroups,
  OptionsReturnType,
  Params,
} from '../../Api';
import { useAppDispatch, useAppSelector } from '../../store';
import { useReadQueryParams } from '../../QueryParams';
import EmailSend from './EmailSend';
import useRequest from '../../Utilities/useRequest';

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

interface RbacGroupsDataType {
  data: any[];
  meta: {
    count: number;
  };
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

  const [downloadType, setDownloadType] = useState('current');
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

  const {
    result: { data },
    request: fetchRbacGroups,
  } = useRequest<RbacGroupsDataType>(
    () => getRbacGroups() as unknown as Promise<RbacGroupsDataType>,
    { data: [], meta: { count: 0 } }
  );

  useEffect(() => {
    // TODO: Update the useRequest hook to return function and not a promise!! @brum
    if (downloadType === 'email') fetchRbacGroups();
  }, [downloadType]);

  const [emailInfo, setEmailInfo] = useState({
    recipient: '',
    subject: `Ansible report: ${slug} is ready to be downloaded`,
    body: 'Ansible Report can be downloaded from: ' + window.location.href,
    reportUrl: window.location.href,
  });

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
            showExtraRows: downloadType === 'extra_rows',
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

  const emailSend = () => {
    // Don't allow user to spam send email button
    if (isLoading) return;

    // Dispatch the email,
    dispatch(
      emailAction(
        {
          recipient: emailInfo.recipient,
          subject:
            emailInfo.subject === ''
              ? 'Report is ready to be downloaded'
              : emailInfo.subject,
          body: emailInfo.body,
          reportUrl: emailInfo.reportUrl,
          payload: 'Download',
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
            {downloadType !== 'email' && (
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
            )}
            {downloadType === 'email' && (
              <Button
                key="email"
                variant={ButtonVariant.primary}
                isDisabled={emailInfo.recipient === ''}
                onClick={() => {
                  setIsExportModalOpen(false);
                  emailSend();
                }}
              >
                Send E-Mail
              </Button>
            )}
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
                  onChange={() => setDownloadType('current')}
                  isChecked={downloadType === 'current'}
                  name="optionSelected"
                  label="Current page"
                  id="current-page-radio"
                  aria-label="current-page-radio"
                />
              </GridItem>
              <GridItem>
                <Radio
                  onChange={() => setDownloadType('extra_rows')}
                  isChecked={downloadType === 'extra_rows'}
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
              <GridItem>
                <Radio
                  onChange={() => setDownloadType('email')}
                  isChecked={downloadType === 'email'}
                  name="optionSelected"
                  label={'Send E-Mail'}
                  id="email-radio"
                  aria-label="email-radio"
                />
              </GridItem>
            </>
          )}
        </Grid>
        {downloadType === 'email' && (
          <Grid>
            <GridItem>
              <EmailSend
                emailInfo={emailInfo}
                onChange={setEmailInfo}
                rbacGroups={data}
              />
            </GridItem>
          </Grid>
        )}
      </Modal>
    </>
  );
};

export default DownloadPdfButton;
