import React, { useState, useEffect, FC, useCallback } from 'react';

import { useQueryParams } from '../../Utilities/useQueryParams';

import styled from 'styled-components';
import LoadingState from '../../Components/ApiStatus/LoadingState';
import NoData from '../../Components/ApiStatus/NoData';
import { readClusters, readNotifications } from '../../Api/';

import Main from '@redhat-cloud-services/frontend-components/Main';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';

import {
  Card,
  CardBody,
  CardTitle as PFCardTitle,
  FormSelect,
  FormSelectOption,
  PaginationVariant,
  NotificationDrawer,
} from '@patternfly/react-core';

import NotificationsList from './NotificationsList';
import Pagination from '../../Components/Pagination';
import { getQSConfig } from '../../Utilities/qs';
import useRequest from '../../Utilities/useRequest';

const CardTitle = styled(PFCardTitle)`
  display: flex;
  justify-content: space-between;

  @media screen and (max-width: 1035px) {
    display: block;
  }
`;

const DropdownGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;

  @media screen and (max-width: 1035px) {
    display: block;
  }

  select {
    margin: 0 10px;
    width: 150px;

    @media screen and (max-width: 1035px) {
      margin: 10px 10px 0 0;
    }

    @media screen and (max-width: 865px) {
      width: 100%;
    }
  }
`;

const notificationOptions = [
  {
    value: 'please choose',
    label: 'Select Notification Severity',
    disabled: true,
  },
  { value: 'error', label: 'View Critical', disabled: false },
  { value: 'warning', label: 'View Warning', disabled: false },
  { value: 'notice', label: 'View Notice', disabled: false },
  { value: '', label: 'View All', disabled: false },
];

const formatClusterName = (
  data: any[]
): { value: string; label: string; disabled: boolean }[] => {
  const defaultClusterOptions = [
    { value: 'please choose', label: 'Select cluster', disabled: true },
    { value: '', label: 'All Clusters', disabled: false },
    { value: '-1', label: 'Unassociated', disabled: false },
  ];

  const calcData = data.map(
    ({ label, cluster_id: id, install_uuid: uuid }) => ({
      value: id as string,
      label: (label ?? uuid) as string,
      disabled: false,
    })
  );

  return [...defaultClusterOptions, ...calcData];
};

const initialQueryParams = {
  defaultParams: {
    limit: 5,
    offset: 0,
    // This is not doing anything opn the v0 api
    sort_options: 'created',
  },
};

interface QsConfig {
  namespace: string;
  defaultParams: Record<string, any>;
  integerFields: string[];
  dateFields: string[];
}

const qsConfig = getQSConfig(
  'notifications',
  { ...initialQueryParams.defaultParams },
  ['limit', 'offset']
) as QsConfig;

interface NotificationDataType {
  notifications: any[];
  meta: {
    count: number;
  };
}

interface ClusterDataType {
  templates: any[];
}

const Notifications: FC<Record<string, never>> = () => {
  const [selectedCluster, setSelectedCluster] = useState('');

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { queryParams, setId, setFromPagination, setSeverity } =
    useQueryParams(qsConfig);

  const { severity, limit, offset } = queryParams as Record<string, string>;

  const {
    result: { notifications: notificationsData, meta },
    error: notificationsError,
    isLoading,
    isSuccess,
    request: fetchNotifications,
  } = useRequest<NotificationDataType>(
    useCallback(
      () =>
        readNotifications(
          queryParams
        ) as unknown as Promise<NotificationDataType>,
      [queryParams]
    ),
    { notifications: [], meta: { count: 0 } }
  );

  const {
    result: { templates: clustersData = [] },
    error: clustersError,
    request: fetchClusters,
  } = useRequest<ClusterDataType>(
    () => readClusters() as unknown as Promise<ClusterDataType>,
    { templates: [] }
  );

  useEffect(() => {
    // TODO: Update the useRequest hook to return function and not a promise!! @brum
    fetchClusters()
      .then(() => ({}))
      .catch(() => ({}));
  }, []);

  useEffect(() => {
    fetchNotifications()
      .then(() => ({}))
      .catch(() => ({}));
  }, [queryParams]);

  return (
    <>
      <PageHeader>
        <PageHeaderTitle title={'Notifications'} />
      </PageHeader>
      <>
        <Main>
          <Card>
            <CardTitle>
              <DropdownGroup>
                <FormSelect
                  name="selectedCluster"
                  value={selectedCluster}
                  onChange={(value) => {
                    setSelectedCluster(value);
                    setId(value);
                    setFromPagination(0);
                  }}
                  aria-label="Select Cluster"
                >
                  {formatClusterName(clustersData).map(
                    ({ value, label, disabled }, index) => (
                      <FormSelectOption
                        isDisabled={disabled}
                        key={index}
                        value={value}
                        label={label}
                      />
                    )
                  )}
                </FormSelect>
                <FormSelect
                  name="selectedNotification"
                  value={severity || ''}
                  onChange={(value) => {
                    setSeverity(value);
                    setFromPagination(0);
                  }}
                  aria-label="Select Notification Type"
                >
                  {notificationOptions.map(
                    ({ disabled, value, label }, index) => (
                      <FormSelectOption
                        isDisabled={disabled}
                        key={index}
                        value={value}
                        label={label}
                      />
                    )
                  )}
                </FormSelect>
              </DropdownGroup>
              <Pagination
                count={meta?.count}
                qsConfig={qsConfig}
                params={{
                  limit: +limit,
                  offset: +offset,
                }}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                /* @ts-ignore */
                setPagination={setFromPagination}
                isCompact
              />
            </CardTitle>
            <CardBody>
              {isLoading && <LoadingState />}
              {isSuccess && notificationsData.length <= 0 && <NoData />}
              {isSuccess && notificationsData.length > 0 && (
                <NotificationDrawer>
                  <NotificationsList
                    filterBy={severity || ''}
                    notifications={notificationsData}
                  />
                </NotificationDrawer>
              )}
              <Pagination
                count={meta?.count}
                qsConfig={qsConfig}
                params={{
                  limit: +limit,
                  offset: +offset,
                }}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                /* @ts-ignore */
                setPagination={setFromPagination}
                variant={PaginationVariant.bottom}
              />
            </CardBody>
          </Card>
        </Main>
      </>
    </>
  );
};

export default Notifications;
