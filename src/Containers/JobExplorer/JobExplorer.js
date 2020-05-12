/* eslint-disable no-debugger */
/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';

import { useQueryParams } from '../../Utilities/useQueryParams';

import styled from 'styled-components';
import LoadingState from '../../Components/LoadingState';
import EmptyState from '../../Components/EmptyState';
import NoData from '../../Components/NoData';
import { preflightRequest, readJobExplorer } from '../../Api';
import { jobExplorer } from '../../Utilities/constants';

import {
    Main,
    PageHeader,
    PageHeaderTitle
} from '@redhat-cloud-services/frontend-components';

import {
    DataToolbar,
    DataToolbarContent,
    DataToolbarFilter,
    DataToolbarToggleGroup,
    DataToolbarGroup
} from '@patternfly/react-core';

import { FilterIcon } from '@patternfly/react-icons';

import {
    Badge,
    Card,
    CardBody,
    CardHeader as PFCardHeader,
    Pagination,
    PaginationVariant,
    Select,
    SelectOption
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
    attributes: jobExplorer.attributes,
    limit: 5,
    offset: 0
};

const statusMenuItems = [
    <SelectOption key="status-failed"  value="Failed" />,
    <SelectOption key="status-failed"  value="Failed" />
];

const typeMenuItems = [
    <SelectOption key="type-template"  value="Template" />,
    <SelectOption key="type-worklow"  value="Workflow" />
];

const buildListFilters = (options) => (
    options.map((option) => {
        return (
            <div key={ option }>{ option }</div>
        );
    })
);

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

    useEffect(() => {
        if (firstRender) {
            return;
        }

        const getData = () => {
            return readJobExplorer({ params: queryParams });
        };

        console.log('queryParams', queryParams);

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
    console.log(jobExplorerData);
    useEffect(() => {
        let ignore = false;
        const fetchEndpoints = () => {
            return Promise.all(
                [ readJobExplorer({ params: queryParams, attributes: 'status' }) ]
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
                                        {/* <DataToolbar id="jobs-data-toolbar">
                                            <DataToolbarContent>
                                                <DataToolbarToggleGroup
                                                    toggleIcon={ <FilterIcon /> }
                                                    breakpoint="xl"
                                                >
                                                    <DataToolbarGroup variant="filter-group">
                                                        <DataToolbarFilter
                                                            categoryName="Status"
                                                            chips={ queryParams.status }
                                                            deleteChip={ () => console.log('deleted') }
                                                        >
                                                            <Select
                                                                aria-label="Status"
                                                                onToggle={ () => console.log('toggled') }
                                                                onSelect={ () => console.log('selected') }
                                                                placeholderText="Status"
                                                                isExpanded="true"
                                                            >
                                                                { statusMenuItems }
                                                            </Select>
                                                        </DataToolbarFilter>
                                                        <DataToolbarFilter categoryName="Type">
                                                            <Select
                                                                aria-label="Type"
                                                                onSelect={ () => console.log('selected') }
                                                                placeholderText="Type"
                                                            >
                                                                { typeMenuItems }
                                                            </Select>
                                                        </DataToolbarFilter>
                                                    </DataToolbarGroup>
                                                </DataToolbarToggleGroup>
                                            </DataToolbarContent>
                                        </DataToolbar> */}
                                        <JobExplorerList
                                            filterByStatus={ queryParams.status || '' }
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
