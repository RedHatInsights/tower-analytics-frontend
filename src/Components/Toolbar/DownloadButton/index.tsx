/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
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
import { Endpoint, OptionsReturnType, Params } from '../../../Api';
import { useAppDispatch, useAppSelector } from '../../../store';
import { useReadQueryParams } from '../../../QueryParams';
import ExportOptions from '../DownloadButton/Steps/ExportOptions';
import PdfDetails from '../DownloadButton/Steps/PdfDetails';
import EmailDetails from '../DownloadButton/Steps/EmailDetails';
import PdfDownload from '../DownloadButton/Steps/PdfDetails/PdfDownload';
import useOptionsData from '../DownloadButton/useOptionsData';
import SendEmail from '../DownloadButton/Steps/EmailDetails/SendEmail';
import { actions } from '../DownloadButton/constants';

interface Props {
  settingsNamespace: string;
  slug: string;
  name: string;
  description: string;
  endpointUrl: Endpoint;
  queryParams: Params;
  selectOptions: OptionsReturnType;
  y: string;
  label: string;
  xTickFormat: string;
  chartType: string;
  totalCount: number;
  onPageCount: number;
  sortOptions: string;
  sortOrder: 'asc' | 'desc';
  dateGranularity: string;
  startDate: string;
  endDate: string;
  dateRange: string;
  inputs?: { automationCost: number; manualCost: number };
}

interface UserProps {
  usernames: string[];
  emails: string[];
}

interface InitialProps {
  downloadType: string;
  showExtraRows: boolean;
  additionalRecipients: string;
  eula: boolean;
  emailExtraRows: boolean;
  subject: string;
  body: string;
  selectedRbacGroups: string[];
  users: UserProps[];
  expiry: string;
}

const DownloadButton: FC<Props> = ({
  settingsNamespace = 'settings',
  slug,
  name,
  description,
  endpointUrl,
  queryParams,
  selectOptions,
  y,
  label,
  xTickFormat,
  chartType,
  totalCount,
  onPageCount,
  sortOptions,
  sortOrder,
  dateGranularity,
  startDate,
  endDate,
  dateRange,
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
  const { formData, dispatchReducer } = useOptionsData({}, name, description);

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
    downloadType === 'pdf'
      ? PdfDownload({
          slug,
          endpointUrl,
          queryParams,
          selectOptions,
          y,
          label,
          xTickFormat,
          chartType,
          sortOptions,
          sortOrder,
          dateGranularity,
          startDate,
          endDate,
          dateRange,
          dispatch,
          chartSeriesHiddenProps,
          showExtraRows,
          inputs,
        })
      : SendEmail({
          slug,
          users,
          additionalRecipients,
          subject,
          body,
          dispatch,
          emailExtraRows,
          expiry,
        });
    dispatchReducer({ type: actions.RESET_DATA });
    setIsExportModalOpen(false);
  };

  const sendEmailButtonDisabled = () => {
    const { additionalRecipients, selectedRbacGroups, users }: InitialProps =
      formData;
    if (additionalRecipients !== '') return false;

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
              name,
              description,
              endpointUrl,
              queryParams,
              selectOptions,
              y,
              label,
              xTickFormat,
              chartType,
              totalCount,
              onPageCount,
              sortOptions,
              sortOrder,
              dateGranularity,
              startDate,
              endDate,
              dateRange,
            }}
            formData={formData}
            dispatchReducer={dispatchReducer}
          />
        ) : (
          <EmailDetails
            options={{ totalCount }}
            formData={formData}
            dispatchReducer={dispatchReducer}
          />
        ),
    },
  ];

  const onStepChange = (step: [string, string]) => {
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
                  onClick={onNext}
                  isDisabled={!downloadType}
                >
                  Next
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

  // const title = `Export report <font size={2}>| ${name}</font>`;
  const title = 'Export report';

  return (
    <>
      <Tooltip position={TooltipPosition.top} content="Export report">
        <Button
          variant={isError ? ButtonVariant.link : ButtonVariant.plain}
          aria-label="Export report"
          onClick={() => setIsExportModalOpen(true)}
          isDanger={isError}
        >
          {isLoading && <Spinner isSVG size="md" />}
          {!isLoading && isError && <ExclamationCircleIcon />}
          {!isLoading && !isError && <DownloadIcon />}
        </Button>
      </Tooltip>
      {isExportModalOpen && (
        <Wizard
          title={title}
          description={`${name} | ${downloadType === 'pdf' ? 'PDF' : 'E-mail'}`}
          steps={steps}
          hideClose={true}
          onNext={onStepChange}
          onBack={onStepChange}
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
