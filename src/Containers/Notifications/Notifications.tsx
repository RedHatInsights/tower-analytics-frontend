import React, { useState, useEffect, FC, useCallback } from 'react';

import { useQueryParams } from '../../QueryParams/';

import styled from 'styled-components';
import LoadingState from '../../Components/ApiStatus/LoadingState';
import NoData from '../../Components/ApiStatus/NoData';
import { readClusters, readNotifications } from '../../Api/';
import useRequest from '../../Utilities/useRequest';

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

interface NotificationDataType {
  notifications: {
    notification_id: number;
    label: string;
    date: string;
    code: string;
    active: boolean;
    message: string;
    tower_url: string;
  }[];
  meta: {
    count: number;
  };
}

interface ClusterDataType {
  templates: {
    label: string;
    cluster_id: number;
    install_uuid: string;
  }[];
}

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
  data: ClusterDataType['templates']
): { value: string; label: string; disabled: boolean }[] => {
  const defaultClusterOptions = [
    { value: 'please choose', label: 'Select cluster', disabled: true },
    { value: '', label: 'All Clusters', disabled: false },
    { value: '-1', label: 'Unassociated', disabled: false },
  ];

  const calcData = data.map(
    ({ label, cluster_id: id, install_uuid: uuid }) => ({
      value: `${id}`,
      label: label ?? uuid,
      disabled: false,
    })
  );

  return [...defaultClusterOptions, ...calcData];
};

const initialQueryParams = {
  defaultParams: {
    limit: '5',
    offset: '0',
  },
};

const Notifications: FC<Record<string, never>> = () => {
  const [selectedCluster, setSelectedCluster] = useState('');

  const { queryParams, setId, setFromPagination, setSeverity } = useQueryParams(
    initialQueryParams.defaultParams
  );

  const { severity, limit, offset } = queryParams as Record<string, string>;

  const {
    result: { notifications: notificationsData, meta },
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
    request: fetchClusters,
  } = useRequest<ClusterDataType>(
    () => readClusters() as unknown as Promise<ClusterDataType>,
    { templates: [] }
  );

  useEffect(() => {
    fetchClusters();
  }, []);

  useEffect(() => {
    fetchNotifications();
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
