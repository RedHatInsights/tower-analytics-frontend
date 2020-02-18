import React, { useState, useEffect } from 'react';
import moment from 'moment';

import { useQueryParams } from '../../Utilities/useQueryParams';

import styled from 'styled-components';
import LoadingState from '../../Components/LoadingState';
import EmptyState from '../../Components/EmptyState';
import NoData from '../../Components/NoData';
import { preflightRequest, readClusters, readNotifications } from '../../Api';

import {
    Main,
    PageHeader,
    PageHeaderTitle
} from '@redhat-cloud-services/frontend-components';

import {
    Card,
    CardBody,
    CardHeader as PFCardHeader,
    FormSelect,
    FormSelectOption,
    Badge,
    Pagination,
    PaginationVariant
} from '@patternfly/react-core';

import NotificationsList from '../../Components/NotificationsList';

const CardHeader = styled(PFCardHeader)`
  display: flex;
  justify-content: space-between;

  @media screen and (max-width: 1035px) {
    display: block;
  }
`;

const TitleWithBadge = styled.div`
  display: flex;
  align-items: center;

  h2 {
    margin-right: 10px;
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

const title = (
    <span>
    Automation Analytics
        <span style={ { fontSize: '16px' } }>
            { ' ' }
            <span style={ { margin: '0 10px' } }>|</span> Notifications
        </span>
    </span>
);

const timeFrameOptions = [
    { value: 'please choose', label: 'Select Date Range', disabled: true },
    { value: 7, label: 'Past Week', disabled: false },
    { value: 14, label: 'Past 2 Weeks', disabled: false },
    { value: 31, label: 'Past Month', disabled: false }
];

const notificationOptions = [
    {
        value: 'please choose',
        label: 'Select Notification Type',
        disabled: true
    },
    { value: 'error', label: 'View Critical', disabled: false },
    { value: 'warning', label: 'View Warning', disabled: false },
    { value: 'notice', label: 'View Notice', disabled: false },
    { value: '', label: 'View All', disabled: false }
];

const perPageOptions = [
    { title: '5', value: 5 },
    { title: '10', value: 10 },
    { title: '20', value: 20 },
    { title: '50', value: 50 },
    { title: '100', value: 100 }
];

function formatClusterName(data) {
    const defaultClusterOptions = [
        { value: 'please choose', label: 'Select Cluster', disabled: true },
        { value: -1, label: 'All Clusters', disabled: false }
    ];
    return data.reduce(
        (formatted, { label, cluster_id: id, install_uuid: uuid }) => {
            if (label.length === 0) {
                formatted.push({ value: id, label: uuid, disabled: false });
            } else {
                formatted.push({ value: id, label, disabled: false });
            }

            return formatted;
        },
        defaultClusterOptions
    );
}

const initialQueryParams = {
    id: -1,
    startDate: moment
    .utc()
    .subtract(1, 'month')
    .format('YYYY-MM-DD'),
    endDate: moment.utc().format('YYYY-MM-DD'),
    limit: 5,
    offset: 0
};

const Notifications = () => {
    const [ preflightError, setPreFlightError ] = useState(null);
    const [ notificationsData, setNotificationsData ] = useState([]);
    const [ clusterOptions, setClusterOptions ] = useState([]);
    const [ clusterTimeFrame, setClusterTimeFrame ] = useState(31);
    const [ selectedCluster, setSelectedCluster ] = useState(-1);
    const [ firstRender, setFirstRender ] = useState(true);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ meta, setMeta ] = useState({});
    const [ currPage, setCurrPage ] = useState(1);
    const {
        queryParams,
        setEndDate,
        setStartDate,
        setId,
        setLimit,
        setOffset,
        setSeverity
    } = useQueryParams(initialQueryParams);

    useEffect(() => {
        if (firstRender) {
            return;
        }

        const fetchEndpoints = () => {
            return Promise.all(
                [ readNotifications({ params: queryParams }) ].map(p => p.catch(() => []))
            );
        };

        const update = () => {
            setIsLoading(true);
            fetchEndpoints().then(
                ([{ notifications: notificationsData = [], meta }]) => {
                    setNotificationsData(notificationsData);
                    setMeta(meta);
                    setIsLoading(false);
                }
            );
        };

        update();
    }, [ queryParams ]);

    useEffect(() => {
        let ignore = false;
        const getData = () => {
            return Promise.all(
                [ readClusters(), readNotifications({ params: queryParams }) ].map(p =>
                    p.catch(() => [])
                )
            );
        };

        async function initializeWithPreflight() {
            setIsLoading(true);
            await window.insights.chrome.auth.getUser();
            await preflightRequest().catch(error => {
                setPreFlightError({ preflightError: error });
            });
            getData().then(
                ([
                    { templates: clustersData = []},
                    { notifications: notificationsData = [], meta }
                ]) => {
                    if (!ignore) {
                        const clusterOptions = formatClusterName(clustersData);
                        setClusterOptions(clusterOptions);
                        setNotificationsData(notificationsData);
                        setMeta(meta);
                        setFirstRender(false);
                        setIsLoading(false);
                    }
                }
            );
        }

        initializeWithPreflight();
        return () => (ignore = true);
    }, []);

    const returnOffsetVal = page => {
        let offsetVal = (page - 1) * queryParams.limit;
        return offsetVal;
    };

    const handleSetPage = page => {
        const nextOffset = returnOffsetVal(page);
        setOffset(nextOffset);
        setCurrPage(page);
    };

    const handlePerPageSelect = (perPage, page) => {
        setLimit(perPage);
        const nextOffset = returnOffsetVal(page);
        setOffset(nextOffset);
        setCurrPage(page);
    };

    return (
        <React.Fragment>
            <PageHeader>
                <PageHeaderTitle title={ title } />
            </PageHeader>
            { preflightError && (
                <Main>
                    <Card>
                        <CardBody>
                            <EmptyState { ...preflightError } />
                        </CardBody>
                    </Card>
                </Main>
            ) }
            { !preflightError && (
        <>
          <Main>
              <Card>
                  <CardHeader>
                      <TitleWithBadge>
                          <h2>
                              <strong>Notifications</strong>
                          </h2>
                          <Badge isRead>{ meta.count ? meta.count : 0 }</Badge>
                      </TitleWithBadge>
                      <DropdownGroup>
                          <FormSelect
                              name="selectedCluster"
                              value={ selectedCluster }
                              onChange={ value => {
                                  setSelectedCluster(value);
                                  setId(value);
                                  setOffset(0);
                                  setCurrPage(1);
                              } }
                              aria-label="Select Cluster"
                          >
                              { clusterOptions.map(({ value, label, disabled }, index) => (
                                  <FormSelectOption
                                      isDisabled={ disabled }
                                      key={ index }
                                      value={ value }
                                      label={ label }
                                  />
                              )) }
                          </FormSelect>
                          <FormSelect
                              name="clusterTimeFrame"
                              value={ clusterTimeFrame }
                              onChange={ value => {
                                  setClusterTimeFrame(+value);
                                  setEndDate();
                                  setStartDate(+value);
                              } }
                              aria-label="Select Date Range"
                          >
                              { timeFrameOptions.map((option, index) => (
                                  <FormSelectOption
                                      isDisabled={ option.disabled }
                                      key={ index }
                                      value={ option.value }
                                      label={ option.label }
                                  />
                              )) }
                          </FormSelect>
                          <FormSelect
                              name="selectedNotification"
                              value={ queryParams.severity || '' }
                              onChange={ value => {
                                  setSeverity(value);
                                  setOffset(0);
                                  setCurrPage(1);
                              } }
                              aria-label="Select Notification Type"
                          >
                              { notificationOptions.map(
                                  ({ disabled, value, label }, index) => (
                                      <FormSelectOption
                                          isDisabled={ disabled }
                                          key={ index }
                                          value={ value }
                                          label={ label }
                                      />
                                  )
                              ) }
                          </FormSelect>
                      </DropdownGroup>
                  </CardHeader>
                  <CardBody>
                      { isLoading && <LoadingState /> }
                      { !isLoading && notificationsData.length <= 0 && <NoData /> }
                      { !isLoading && notificationsData.length > 0 && (
                  <>
                    <NotificationsList
                        filterBy={ queryParams.severity || '' }
                        options={ notificationOptions }
                        notifications={ notificationsData }
                    />
                    <Pagination
                        itemCount={ meta.count ? meta.count : 0 }
                        widgetId="pagination-options-menu-bottom"
                        perPageOptions={ perPageOptions }
                        perPage={ queryParams.limit }
                        page={ currPage }
                        variant={ PaginationVariant.bottom }
                        dropDirection={ 'up' }
                        onPerPageSelect={ (_event, perPage, page) => {
                            handlePerPageSelect(perPage, page);
                        } }
                        onSetPage={ (_event, pageNumber) => {
                            handleSetPage(pageNumber);
                        } }
                        style={ { marginTop: '20px' } }
                    />
                  </>
                      ) }
                  </CardBody>
              </Card>
          </Main>
        </>
            ) }
        </React.Fragment>
    );
};

export default Notifications;
