import React, { useState, useEffect } from 'react';

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
    CardTitle as PFCardTitle,
    FormSelect,
    FormSelectOption,
    Pagination,
    PaginationVariant,
    NotificationDrawer
} from '@patternfly/react-core';

import NotificationsList from '../../Components/NotificationsList';

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
        { value: 'please choose', label: 'Select cluster', disabled: true },
        { value: '', label: 'All Clusters', disabled: false },
        { value: -1, label: 'Unassociated', disabled: false }
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
    limit: 5,
    offset: 0
};

const Notifications = () => {
    const [ preflightError, setPreFlightError ] = useState(null);
    const [ notificationsData, setNotificationsData ] = useState([]);
    const [ clusterOptions, setClusterOptions ] = useState([]);
    const [ selectedCluster, setSelectedCluster ] = useState('');
    const [ firstRender, setFirstRender ] = useState(true);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ meta, setMeta ] = useState({});
    const [ currPage, setCurrPage ] = useState(1);
    const {
        queryParams,
        setId,
        setLimit,
        setOffset,
        setSeverity
    } = useQueryParams(initialQueryParams);

    useEffect(() => {
        if (firstRender) {
            return;
        }

        const getData = () => {
            return readNotifications({ params: queryParams });
        };

        const update = () => {
            setIsLoading(true);
            getData().then(({ notifications: notificationsData = [], meta }) => {
                setNotificationsData(notificationsData);
                setMeta(meta);
                setIsLoading(false);
            });
        };

        update();
    }, [ queryParams ]);

    useEffect(() => {
        insights.chrome.appNavClick({ id: 'notifications', secondaryNav: true });

        let ignore = false;
        const fetchEndpoints = () => {
            return Promise.all(
                [ readClusters(), readNotifications({ params: queryParams }) ].map(p =>
                    p.catch(() => [])
                )
            );
        };

        async function initializeWithPreflight() {
            setIsLoading(true);
            await preflightRequest().catch(error => {
                setPreFlightError({ preflightError: error });
            });
            fetchEndpoints().then(
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
                <PageHeaderTitle title={'Notifications'} />
            </PageHeader>
            {preflightError && (
                <Main>
                    <EmptyState {...preflightError} />
                </Main>
            )}
            {!preflightError && (
                <>
                    <Main>
                        <Card>
                            <CardTitle>
                                <DropdownGroup>
                                    <FormSelect
                                        name="selectedCluster"
                                        value={selectedCluster}
                                        onChange={value => {
                                            setSelectedCluster(value);
                                            setId(value);
                                            setOffset(0);
                                            setCurrPage(1);
                                        }}
                                        aria-label="Select Cluster"
                                    >
                                        {clusterOptions.map(({ value, label, disabled }, index) => (
                                            <FormSelectOption
                                                isDisabled={disabled}
                                                key={index}
                                                value={value}
                                                label={label}
                                            />
                                        ))}
                                    </FormSelect>
                                    <FormSelect
                                        name="selectedNotification"
                                        value={queryParams.severity || ''}
                                        onChange={value => {
                                            setSeverity(value);
                                            setOffset(0);
                                            setCurrPage(1);
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
                                    itemCount={meta && meta.count ? meta.count : 0}
                                    widgetId="pagination-options-menu-top"
                                    perPageOptions={perPageOptions}
                                    perPage={queryParams.limit}
                                    page={currPage}
                                    variant={PaginationVariant.top}
                                    onPerPageSelect={(_event, perPage, page) => {
                                        handlePerPageSelect(perPage, page);
                                    }}
                                    onSetPage={(_event, pageNumber) => {
                                        handleSetPage(pageNumber);
                                    }}
                                    isCompact
                                />
                            </CardTitle>
                            <CardBody>
                                {isLoading && <LoadingState />}
                                {!isLoading && notificationsData.length <= 0 && <NoData />}
                                {!isLoading && notificationsData.length > 0 && (
                                    <NotificationDrawer>
                                        <NotificationsList
                                            filterBy={queryParams.severity || ''}
                                            options={notificationOptions}
                                            notifications={notificationsData}
                                        />
                                    </NotificationDrawer>
                                )}
                                <Pagination
                                    itemCount={meta && meta.count ? meta.count : 0}
                                    widgetId="pagination-options-menu-bottom"
                                    perPageOptions={perPageOptions}
                                    perPage={queryParams.limit}
                                    page={currPage}
                                    variant={PaginationVariant.bottom}
                                    onPerPageSelect={(_event, perPage, page) => {
                                        handlePerPageSelect(perPage, page);
                                    }}
                                    onSetPage={(_event, pageNumber) => {
                                        handleSetPage(pageNumber);
                                    }}
                                    style={{ marginTop: '20px' }}
                                />
                            </CardBody>
                        </Card>
                    </Main>
                </>
            )}
        </React.Fragment>
    );
};

export default Notifications;
