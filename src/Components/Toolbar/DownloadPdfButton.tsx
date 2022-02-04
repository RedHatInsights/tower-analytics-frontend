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
  getRbacPrincipals,
  OptionsReturnType,
  Params,
} from '../../Api';
import { useAppDispatch, useAppSelector } from '../../store';
import { useReadQueryParams } from '../../QueryParams';
import EmailSend from './EmailSend';
import useRequest from '../../Utilities/useRequest';
import { string } from 'prop-types';

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
}

interface RbacGroupsDataType {
  data: any[];
  meta: {
    count: number;
  };
}

interface RbacPrincipalsDataType {
  data: any[];
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
    recipient: [],
    users: [],
    subject: `The Ansible report, ${name}, is available for view`,
    body:
      'This report shows ' +
      description[0].toLowerCase() +
      description.substring(1),
    reportUrl: window.location.href,
  });

  // @ts-ignore
  const {
    result: { data: users },
    request: fetchRbacPrincipals,
  } = useRequest<RbacPrincipalsDataType>(
    () =>
      getRbacPrincipals({
        uuid: emailInfo.recipient.at(-1),
      }) as unknown as Promise<RbacPrincipalsDataType>,
    { data: [] }
  );

  useEffect(() => {
    // TODO: Update the useRequest hook to return function and not a promise!! @brum
    // api call if last selected group was unselected or groups are selected
    // if (emailInfo.recipient.length > 0 || emailInfo.users.length > 0)
    if (emailInfo.recipient.length > 0) fetchRbacPrincipals();
  }, [emailInfo.recipient]);

  const getGroupDescription = (key: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return data.filter((group) => group.uuid === key)[0].name;
  };

  const getRecipients = (users: any[]) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const usersList = users.map(
      (user: Record<string, string>) => user.username
    );
    let lastRecipient = '';
    // @ts-ignore
    lastRecipient = emailInfo.recipient.at(-1);
    const userHash = {
      uuid: lastRecipient,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      name: getGroupDescription(lastRecipient),
      emails: usersList,
    };
    const index = emailInfo.users.findIndex(
      (object) => object['uuid'] === userHash['uuid']
    );
    if (index === -1) {
      // @ts-ignore
      emailInfo.users.push(userHash);
    }
    setEmailInfo({ ...emailInfo });
    return usersList;
  };

  useEffect(() => {
    if (users.length > 0) getRecipients(users);
  }, [users]);

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

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    // @ts-ignore
    const all_recipients = emailInfo.users.map((user) => user.emails);

    // Dispatch the email,
    dispatch(
      emailAction(
        {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          recipient: all_recipients.flat(),
          subject:
            emailInfo.subject === ''
              ? 'Report is ready to be viewed'
              : emailInfo.subject,
          body: emailInfo.body.toString().replace(/(?:\r\n|\r|\n)/g, '<br>'),
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
        variant={ModalVariant.medium}
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
                isDisabled={emailInfo.recipient.length == 0}
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
          <Grid style={{ paddingTop: '15px' }}>
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
