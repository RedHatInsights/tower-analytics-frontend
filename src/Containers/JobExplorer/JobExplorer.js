/* eslint-disable no-debugger */
/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';

import { useQueryParams } from '../../Utilities/useQueryParams';

import styled from 'styled-components';
import LoadingState from '../../Components/LoadingState';
import EmptyState from '../../Components/EmptyState';
import NoData from '../../Components/NoData';
import { preflightRequest, readJobExplorer } from '../../Api';

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
    Pagination,
    PaginationVariant
} from '@patternfly/react-core';

import JobExplorerList from '../../Components/JobExplorerList';

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

const perPageOptions = [
    { title: '5', value: 5 },
    { title: '10', value: 10 },
    { title: '20', value: 20 },
    { title: '50', value: 50 },
    { title: '100', value: 100 }
];

const initialQueryParams = {
    limit: 5,
    offset: 0
};

const JobExplorer = () => {
    const [ preflightError, setPreFlightError ] = useState(null);
    const [ jobExplorerData, setJobExplorerData ] = useState([]);
    const [ firstRender, setFirstRender ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ meta, setMeta ] = useState({});
    const [ currPage, setCurrPage ] = useState(1);
    const {
        queryParams,
        // setId,
        setLimit,
        setOffset
        // setStatusType
    } = useQueryParams(initialQueryParams);

    console.log(meta);

    useEffect(() => {
        if (firstRender) {
            return;
        }

        const getData = () => {
            return readJobExplorer();
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
    }, []);

    useEffect(() => {
        let ignore = false;
        const fetchEndpoints = () => {
            return Promise.all(
                [ readJobExplorer({ params: {}}) ]
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
                    { items: jobExplorerData = [], meta }
                ]) => {
                    if (!ignore) {
                        console.log(jobExplorerData);
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

    const returnOffsetVal = page => {
        let offsetVal = (page - 1) * queryParams.limit;
        return offsetVal;
    };

    const title = (
        <span>
        Automation Analytics
            <span style={ { fontSize: '16px' } }>
                { ' ' }
                <span style={ { margin: '0 10px' } }>|</span> All Jobs
            </span>
        </span>
    );

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
                                        <strong>Total Jobs</strong>
                                    </h2>
                                    <Badge isRead>{ meta.count ? meta.count : 0 }</Badge>
                                </TitleWithBadge>
                            </CardHeader>
                            <CardBody>
                                { isLoading && <LoadingState /> }
                                { !isLoading && jobExplorerData.length <= 0 && <NoData /> }
                                { !isLoading && jobExplorerData.length > 0 && (
                                    <>
                                        <JobExplorerList
                                            jobs={ jobExplorerData }
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

export default JobExplorer;
