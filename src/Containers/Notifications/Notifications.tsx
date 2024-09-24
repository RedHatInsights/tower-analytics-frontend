import { CardTitle } from '@patternfly/react-core/dist/dynamic/components/Card';
import { Card } from '@patternfly/react-core/dist/dynamic/components/Card';
import { CardBody } from '@patternfly/react-core/dist/dynamic/components/Card';
import { FormSelect } from '@patternfly/react-core/dist/dynamic/components/FormSelect';
import { FormSelectOption } from '@patternfly/react-core/dist/dynamic/components/FormSelect';
import { NotificationDrawer } from '@patternfly/react-core/dist/dynamic/components/NotificationDrawer';
import { PageSection } from '@patternfly/react-core/dist/dynamic/components/Page';
import { PaginationVariant } from '@patternfly/react-core/dist/dynamic/components/Pagination';
import { Flex } from '@patternfly/react-core/dist/dynamic/layouts/Flex';
import { FlexItem } from '@patternfly/react-core/dist/dynamic/layouts/Flex';
import React, { FC, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Params, readClusters, readNotifications } from '../../Api/';
import LoadingState from '../../Components/ApiStatus/LoadingState';
import NoData from '../../Components/ApiStatus/NoData';
import Pagination from '../../Components/Pagination';
import { useQueryParams } from '../../QueryParams/';
import useRequest from '../../Utilities/useRequest';
import { PageHeader } from '../../framework/PageHeader';
import NotificationsList from './NotificationsList';

const NCardTitle = styled(CardTitle)`
  display: flex;
  justify-content: space-between;

  @media screen and (max-width: 1035px) {
    display: block;
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

  const { queryParams, setId, setFromPagination, setSeverity } = useQueryParams(
    initialQueryParams.defaultParams
  );

  const { severity, limit, offset } = queryParams as Record<string, string>;

  const {
    result: { notifications: notificationsData, meta },
    isLoading,
    isSuccess,
    error,
    request: fetchNotifications,
  } = useRequest<NotificationDataType>(
    useCallback(
      () =>
        readNotifications(
          queryParams as Params
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
    // TODO: Update the useRequest hook to return function and not a promise!! @brum
    fetchClusters();
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [queryParams]);

  return (
    <>
      <PageHeader title={'Notifications'} />
      <>
        <PageSection>
          <Card>
            <NCardTitle>
              <Flex direction={{ default: 'row' }}>
                <FlexItem>
                  <FormSelect
                    name='selectedCluster'
                    value={selectedCluster}
                    onChange={(_event, value) => {
                      setSelectedCluster(value);
                      setId(value);
                      setFromPagination(0);
                    }}
                    aria-label='Select Cluster'
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
                </FlexItem>
                <FlexItem>
                  <FormSelect
                    name='selectedNotification'
                    value={severity || ''}
                    onChange={(_event, value) => {
                      setSeverity(value);
                      setFromPagination(0);
                    }}
                    aria-label='Select Notification Type'
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
                </FlexItem>
              </Flex>
              <Pagination
                count={meta?.count}
                params={{
                  limit: +limit,
                  offset: +offset,
                }}
                /* @ts-ignore */
                setPagination={setFromPagination}
                isCompact
              />
            </NCardTitle>
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
              {error && <NoData />}
              <Pagination
                count={meta?.count}
                params={{
                  limit: +limit,
                  offset: +offset,
                }}
                /* @ts-ignore */
                setPagination={setFromPagination}
                variant={PaginationVariant.bottom}
              />
            </CardBody>
          </Card>
        </PageSection>
      </>
    </>
  );
};

export default Notifications;
