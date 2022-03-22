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
import { useHistory } from 'react-router-dom';

import { downloadPdf as downloadPdfAction } from '../../store/pdfDownloadButton/actions';
import { email as emailAction } from '../../store/pdfDownloadButton/actions';
import { DownloadState } from '../../store/pdfDownloadButton/types';
import {
  Endpoint,
  readRbacGroups,
  readRbacPrincipals,
  OptionsReturnType,
  Params,
} from '../../Api';
import { useAppDispatch, useAppSelector } from '../../store';
import { useReadQueryParams } from '../../QueryParams';
import EmailDetailsForm from './EmailDetailsForm';
import useRequest from '../../Utilities/useRequest';

import {
  EmailDetailsType,
  RbacGroupFromApi,
  RbacPrincipalFromApi,
  User,
} from './types';
import { useFeatureFlag, ValidFeatureFlags } from '../../FeatureFlags';
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

interface RbacGroupsDataType {
  data: RbacGroupFromApi[];
  meta: {
    count: number;
  };
}
interface RbacPrincipalsDataType {
  data: RbacPrincipalFromApi[];
}

const DownloadPdfButton: FC<Props> = ({
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
  const [downloadType, setDownloadType] = useState('current');
  const sendEmailEnabled = useFeatureFlag(ValidFeatureFlags.sendEmail);

  const initializeEmailInfo: EmailDetailsType = {
    selectedRbacGroups: [],
    users: [],
    subject: `The Ansible report, ${name}, is available for view`,
    body:
      'This report shows ' +
      description[0].toLowerCase() +
      description.substring(1),
    reportUrl: window.location.href,
  };

  const [emailInfo, setEmailInfo] =
    useState<EmailDetailsType>(initializeEmailInfo);
  const { selectedRbacGroups, users, subject, body, reportUrl } = emailInfo;

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

  const {
    result: { data: rbacGroupsFromApi },
    request: fetchRbacGroups,
  } = useRequest<RbacGroupsDataType>(
    () => readRbacGroups() as unknown as Promise<RbacGroupsDataType>,
    { data: [], meta: { count: 0 } }
  );

  useEffect(() => {
    if (downloadType === 'email') fetchRbacGroups();
  }, [downloadType]);
  const history = useHistory();

  const unlisten = history.listen(() => {
    setEmailInfo({
      ...initializeEmailInfo,
      ['reportUrl']: window.location.href,
    });
  });

  const {
    result: { data: principalsFromApi },
    request: fetchRbacPrincipals,
  } = useRequest<RbacPrincipalsDataType>(
    () =>
      readRbacPrincipals(
        selectedRbacGroups.at(-1) as string
      ) as unknown as Promise<RbacPrincipalsDataType>,
    { data: [] }
  );

  useEffect(() => {
    if (selectedRbacGroups.length > 0) fetchRbacPrincipals();
  }, [selectedRbacGroups]);

  const getGroupName = (key: string) => {
    return rbacGroupsFromApi.find((group) => group.uuid === key)?.name;
  };

  const updateEmailInfo = () => {
    const usersList = principalsFromApi.map((user) => user.username);

    const lastSelectedRbacGroup = selectedRbacGroups.at(-1) as string;
    const userHash = {
      uuid: lastSelectedRbacGroup,
      name: getGroupName(lastSelectedRbacGroup) as string,
      emails: usersList,
    };
    const index = users.findIndex((object) => object.uuid === userHash.uuid);
    if (index === -1) {
      emailInfo.users.push(userHash as User);
    }
    setEmailInfo({ ...emailInfo });
  };

  useEffect(() => {
    if (selectedRbacGroups.length > 0) updateEmailInfo();
  }, [principalsFromApi]);
  const allParams = inputs ? { ...queryParams, inputs } : queryParams;

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
            queryParams: allParams,
            selectOptions,
            chartSeriesHiddenProps,
            sortOptions,
            sortOrder,
            dateGranularity,
            startDate,
            endDate,
            dateRange,
          },
        },
        dispatch,
        slug
      )
    );
  };

  const resetEmailDetails = () => {
    setIsExportModalOpen(false);
    setEmailInfo({
      ...initializeEmailInfo,
    });
    unlisten();
  };

  const emailSend = () => {
    // Don't allow user to spam send email button
    if (isLoading) return;

    const all_recipients = users.map(({ emails }) => emails);

    // Dispatch the email,
    dispatch(
      emailAction(
        {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          recipient: all_recipients.flat(),
          subject: subject === '' ? 'Report is ready to be viewed' : subject,
          body: body.toString().replace(/(?:\r\n|\r|\n)/g, '<br>'),
          reportUrl: reportUrl,
          payload: 'Download',
        },
        dispatch,
        slug
      )
    );
    resetEmailDetails();
  };

  const sendEmailButtonDisabled = () => {
    if (emailInfo.selectedRbacGroups.length === 0) return true;
    if (
      emailInfo.users.length === 0 ||
      (emailInfo.users.length === 1 && emailInfo.users[0].emails.length <= 0)
    )
      return true;
  };

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
      <Modal
        variant={ModalVariant.medium}
        title="Export report"
        isOpen={isExportModalOpen}
        onClose={() => {
          resetEmailDetails();
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
                isDisabled={sendEmailButtonDisabled()}
                onClick={() => {
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
            onClick={() => {
              resetEmailDetails();
            }}
          >
            Cancel
          </Button>,
        ]}
      >
        <Grid md={4}>
          {totalCount <= onPageCount ? (
            <GridItem>
              <Radio
                onChange={() => setDownloadType('extra_rows')}
                isChecked={downloadType === 'extra_rows'}
                name="optionSelected"
                label={`Download all ${totalCount} items as PDF`}
                id="total-count-radio"
                aria-label="total-count-radio"
              />
            </GridItem>
          ) : (
            <>
              <GridItem>
                <Radio
                  onChange={() => setDownloadType('current')}
                  isChecked={downloadType === 'current'}
                  name="optionSelected"
                  label="Download current page as PDF"
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
                      ? `Download all ${totalCount} items as PDF`
                      : `Download top 100 of ${totalCount} items as PDF`
                  }
                  id="total-count-radio"
                  aria-label="total-count-radio"
                />
              </GridItem>
            </>
          )}
          {sendEmailEnabled && (
            <GridItem>
              <Radio
                onChange={() => setDownloadType('email')}
                isChecked={downloadType === 'email'}
                name="optionSelected"
                label="Send E-Mail"
                id="email-radio"
                aria-label="email-radio"
              />
            </GridItem>
          )}
        </Grid>
        {downloadType === 'email' && (
          <Grid style={{ paddingTop: '15px' }}>
            <GridItem>
              <EmailDetailsForm
                emailInfo={emailInfo}
                onChange={setEmailInfo}
                allRbacGroups={rbacGroupsFromApi}
              />
            </GridItem>
          </Grid>
        )}
      </Modal>
    </>
  );
};

export default DownloadPdfButton;
