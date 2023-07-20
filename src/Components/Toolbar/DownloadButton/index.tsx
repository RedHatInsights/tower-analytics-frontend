import React, { FC, useState } from 'react';
import {
  Button,
  ButtonVariant,
  Spinner,
  Tooltip,
  TooltipPosition,
  Wizard,
  WizardContextConsumer,
  WizardFooter,
} from '@patternfly/react-core';
import { DownloadIcon, ExclamationCircleIcon } from '@patternfly/react-icons';
import { DownloadState } from '../../../store/pdfDownloadButton/types';
import {
  Endpoint,
  OptionsReturnType,
  Params,
  PDFEmailParams,
} from '../../../Api';
import { useAppDispatch, useAppSelector } from '../../../store';
import { useReadQueryParams } from '../../../QueryParams';
import ExportOptions from '../DownloadButton/Steps/ExportOptions';
import PdfDetails from '../DownloadButton/Steps/PdfDetails';
import EmailDetails from '../DownloadButton/Steps/EmailDetails';
import PdfDownload from '../DownloadButton/Steps/PdfDetails/PdfDownload';
import useOptionsData from '../DownloadButton/useOptionsData';
import SendEmail from '../DownloadButton/Steps/EmailDetails/SendEmail';
import { actions } from '../DownloadButton/constants';
import { EmailDetailsProps } from '../types';
import { getDateFormatByGranularity } from '../../../Utilities/helpers';

interface Props {
  settingsNamespace: string;
  slug: string;
  isMoney: boolean;
  name: string;
  description: string;
  endpointUrl: Endpoint;
  queryParams: Params;
  selectOptions: OptionsReturnType;
  y: string;
  label: string;
  xTickFormat: string;
  themeColor?: string;
  chartType: string;
  totalPages: number;
  pageLimit: number;
  sortOptions: string;
  sortOrder: 'asc' | 'desc';
  dateGranularity: string;
  startDate: string;
  endDate: string;
  dateRange: string;
  adoptionRateType: string;
  inputs?: { automationCost: number; manualCost: number };
}

const DownloadButton: FC<Props> = ({
  settingsNamespace = 'settings',
  slug,
  isMoney,
  name,
  description,
  endpointUrl,
  queryParams,
  selectOptions,
  y,
  label,
  xTickFormat,
  themeColor,
  chartType,
  totalPages,
  pageLimit,
  sortOptions,
  sortOrder,
  dateGranularity,
  startDate,
  endDate,
  dateRange,
  adoptionRateType,
  inputs,
}) => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state?.pdfDownloadButton[slug]);
  const isLoading = status === DownloadState.pending;
  const isError = status === DownloadState.rejected;
  const { chartSeriesHiddenProps } = useReadQueryParams(
    {
      chartSeriesHiddenProps: [],
    },
    settingsNamespace
  );
  const [stepIdSelected, setStepIdSelected] = useState(1);
  const { formData, dispatchReducer } = useOptionsData(
    {} as EmailDetailsProps,
    name,
    description
  );

  const {
    users,
    additionalRecipients,
    subject,
    body,
    emailExtraRows,
    showExtraRows,
    downloadType,
    expiry,
  } = formData;

  const onSave = () => {
    if (downloadType === 'pdf')
      PdfDownload({
        slug,
        isMoney,
        endpointUrl,
        queryParams,
        selectOptions,
        y,
        label,
        xTickFormat,
        themeColor: themeColor ? themeColor : '',
        chartType,
        totalPages,
        pageLimit,
        sortOptions,
        sortOrder,
        dateGranularity,
        startDate,
        endDate,
        dateRange,
        adoptionRateType,
        dispatch,
        chartSeriesHiddenProps,
        showExtraRows,
        inputs,
      });
    if (downloadType === 'email') {
      const chartParams = {
        y: queryParams.sort_options as string,
        label: queryParams.sort_options,
        xTickFormat: getDateFormatByGranularity(
          queryParams.granularity as string
        ),
        themeColor: themeColor,
        chartType: chartType,
      };
      const allParams = inputs ? { ...queryParams, inputs } : queryParams;
      const pdfPostBody: PDFEmailParams = {
        slug,
        schemaParams: {
          y: chartParams.y,
          label: chartParams.label as string,
          xTickFormat: chartParams.xTickFormat,
          themeColor: chartParams.themeColor ? chartParams.themeColor : '',
          chartType: chartParams.chartType,
        },
        dataFetchingParams: {
          expiry: expiry,
          showExtraRows: showExtraRows,
          endpointUrl: endpointUrl,
          queryParams: allParams,
          chartSeriesHiddenProps: chartSeriesHiddenProps || [],
          totalPages: totalPages,
          isMoney: isMoney,
          pageLimit: pageLimit,
          sortOptions: queryParams.sort_options as string,
          sortOrder: queryParams.sort_order === 'desc' ? 'desc' : 'asc',
          dateGranularity: queryParams.granularity as string,
          startDate: queryParams.start_date as string,
          endDate: queryParams.end_date as string,
          dateRange: queryParams.quick_date_range as string,
          adoptionRateType: queryParams.adoption_rate_type as string,
        },
      };
      SendEmail({
        slug,
        users,
        additionalRecipients,
        subject,
        body,
        dispatch,
        emailExtraRows,
        expiry,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        pdfPostBody,
      });
    }
    dispatchReducer({ type: actions.RESET_DATA });
    setIsExportModalOpen(false);
  };

  const sendEmailButtonDisabled = () => {
    const {
      additionalRecipients,
      selectedRbacGroups,
      users,
    }: EmailDetailsProps = formData;
    if (additionalRecipients !== '') {
      const list = additionalRecipients.split(',');
      for (let i = 0; i < list.length; i++) {
        const regEx = /^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        if (!regEx.test(list[i])) {
          return true;
        }
      }
      return false;
    }
    // no group selected and no additional email and eula not checked
    if (selectedRbacGroups.length === 0 && additionalRecipients === '')
      return true;

    // (group not selected or group selected but has no users) or additional recipients provide but eula not checked
    if (
      (users.length === 0 ||
        (users.length === 1 && users[0].emails.length <= 0)) &&
      additionalRecipients === ''
    )
      return true;
  };

  const steps = [
    {
      id: 1,
      name: 'Export format',
      component: (
        <ExportOptions formData={formData} dispatchReducer={dispatchReducer} />
      ),
    },
    {
      id: 2,
      name: 'Configure details',
      nextButtonText: downloadType === 'pdf' ? 'Export' : 'Send e-mail',
      component:
        downloadType === 'pdf' ? (
          <PdfDetails
            options={{
              settingsNamespace: 'settings',
              slug,
              isMoney,
              name,
              description,
              endpointUrl,
              queryParams,
              selectOptions,
              y,
              label,
              xTickFormat,
              themeColor: themeColor ? themeColor : '',
              chartType,
              totalPages,
              pageLimit,
              sortOptions,
              sortOrder,
              dateGranularity,
              startDate,
              endDate,
              dateRange,
              adoptionRateType,
            }}
            formData={formData}
            dispatchReducer={dispatchReducer}
          />
        ) : (
          <EmailDetails
            options={{ totalPages, pageLimit }}
            formData={formData}
            dispatchReducer={dispatchReducer}
          />
        ),
    },
  ];

  const onStepChange = (step: { id: React.SetStateAction<number> }) => {
    setStepIdSelected(stepIdSelected < step?.id ? step.id : stepIdSelected);
  };

  const onClose = () => {
    dispatchReducer({ type: actions.RESET_DATA });
    setIsExportModalOpen(false);
  };

  const CustomFooter = (
    <WizardFooter>
      <WizardContextConsumer>
        {({ activeStep, onNext, onBack }) => {
          if (activeStep.id !== 2) {
            return (
              <>
                <Button
                  variant={ButtonVariant.primary}
                  type="submit"
                  onClick={
                    downloadType === 'pdf' && totalPages <= 1 ? onSave : onNext
                  }
                  isDisabled={!downloadType}
                >
                  {downloadType === 'pdf' && totalPages <= 1
                    ? 'Export'
                    : 'Next'}
                </Button>
                {activeStep.id !== 1 && (
                  <Button variant="secondary" onClick={onBack}>
                    Back
                  </Button>
                )}
                <Button variant="link" onClick={onClose}>
                  Cancel
                </Button>
              </>
            );
          }
          // Final step buttons
          return (
            <>
              <Button
                variant={ButtonVariant.primary}
                type="submit"
                onClick={onSave}
                isDisabled={
                  downloadType === 'email' ? sendEmailButtonDisabled() : false
                }
              >
                {downloadType === 'email' ? 'Send e-mail' : 'Export'}
              </Button>
              <Button variant="secondary" onClick={onBack}>
                Back
              </Button>
              <Button variant="link" onClick={onClose}>
                Cancel
              </Button>
            </>
          );
        }}
      </WizardContextConsumer>
    </WizardFooter>
  );

  const title = 'Export report';

  return (
    <>
      <Tooltip position={TooltipPosition.top} content="Export report">
        <Button
          variant={isError ? ButtonVariant.link : ButtonVariant.plain}
          aria-label="Export report"
          onClick={() => setIsExportModalOpen(true)}
          isDanger={isError}
          data-cy={'download-button'}
        >
          {isLoading && (
            <Spinner data-cy={'download-button-loading'} isSVG size="md" />
          )}
          {!isLoading && isError && (
            <ExclamationCircleIcon data-cy={'download-button-error'} />
          )}
          {!isLoading && !isError && (
            <DownloadIcon data-cy={'download-button-icon'} />
          )}
        </Button>
      </Tooltip>
      {isExportModalOpen && (
        <Wizard
          title={title}
          description={`${name} | ${downloadType === 'pdf' ? 'PDF' : 'E-mail'}`}
          steps={steps}
          hideClose={true}
          onNext={() => onStepChange}
          onBack={() => onStepChange}
          onSave={onSave}
          onClose={() => {
            onClose();
          }}
          footer={CustomFooter}
          isOpen={isExportModalOpen}
        />
      )}
    </>
  );
};

export default DownloadButton;
