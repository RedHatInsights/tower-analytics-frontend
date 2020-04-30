/* eslint-disable no-debugger */
/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';

import { useQueryParams } from '../../Utilities/useQueryParams';

import styled from 'styled-components';
import LoadingState from '../../Components/LoadingState';
import EmptyState from '../../Components/EmptyState';
import NoData from '../../Components/NoData';
import { preflightRequest, readClusters, readJobExplorer } from '../../Api';

import {
    Main,
    PageHeader,
    PageHeaderTitle
} from '@redhat-cloud-services/frontend-components';

import {
    Badge,
    Card,
    CardBody,
    CardHeader as PFCardHeader,
    FormSelect,
    FormSelectOption
} from '@patternfly/react-core';

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

const JobExplorer = () => {
    debugger;
    const [ preflightError, setPreFlightError ] = useState(null);
    const [ jobExplorerData, setJobExplorerData ] = useState([]);
    const [ clusterOptions, setClusterOptions ] = useState([]);
    const [ selectedCluster, setSelectedCluster ] = useState('');
    const [ firstRender, setFirstRender ] = useState(true);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ meta, setMeta ] = useState({});
    const {
        queryParams,
        setId,
        // setLimit,
        setOffset
    } = useQueryParams(initialQueryParams);

    useEffect(() => {
        if (firstRender) {
            return;
        }

        const getData = () => {
            return readJobExplorer({ params: queryParams });
        };

        const update = async () => {
            setIsLoading(true);
            await window.insights.chrome.auth.getUser();
            getData().then(
                ({ jobExplorer: jobExplorerData = [], meta }) => {
                    setJobExplorerData(jobExplorerData);
                    setMeta(meta);
                    setIsLoading(false);
                }
            );
        };

        update();
    }, [ queryParams ]);

    useEffect(() => {
        let ignore = false;
        const fetchEndpoints = () => {
            return Promise.all(
                [ readClusters(), readJobExplorer({ params: queryParams }) ].map(p =>
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
            fetchEndpoints().then(
                ([
                    { templates: clustersData = []},
                    { jobExplorer: jobExplorerData = [], meta }
                ]) => {
                    if (!ignore) {
                        const clusterOptions = formatClusterName(clustersData);
                        setClusterOptions(clusterOptions);
                        setJobExplorerData(jobExplorerData);
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

    console.log(jobExplorerData);

    const title = (
        <span>
        Automation Analytics
            <span style={ { fontSize: '16px' } }>
                { ' ' }
                <span style={ { margin: '0 10px' } }>|</span> All Jobs
            </span>
        </span>
    );

    return (
        <React.Fragment>
            <PageHeader>
                <PageHeaderTitle title={ title } />
            </PageHeader>

            { preflightError && (
                <Main>
                    <EmptyState { ...preflightError }  />
                </Main>
            ) }

            { !preflightError && (
                <>
                    <Main>
                        <Card>
                            <CardHeader>
                                <TitleWithBadge>
                                    <h2>
                                        <strong>Job Explorer</strong>
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
                                </DropdownGroup>
                            </CardHeader>
                            <CardBody>
                                { isLoading && <LoadingState /> }
                                { !isLoading && jobExplorerData.length <= 0 && <NoData /> }
                                <div>FOOBAR</div>
                            </CardBody>
                        </Card>
                    </Main>
                </>
            ) }
        </React.Fragment>
    );
};

export default JobExplorer;
