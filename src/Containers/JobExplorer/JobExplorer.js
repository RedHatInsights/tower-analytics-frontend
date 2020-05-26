/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';

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
} from '@patternfly/react-core/dist/umd/experimental';

import { FilterIcon } from '@patternfly/react-icons';

import {
    Badge,
    Card,
    CardBody,
    CardHeader as PFCardHeader,
    Pagination,
    PaginationVariant,
    Select,
    SelectOption,
    SelectVariant
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
    limit: 5
};

const statusMenuItems = [
    <SelectOption key="status-success"  value="successful" />,
    <SelectOption key="status-failed"  value="failed" />,
    <SelectOption key="status-all"  value="All" data-value="all" />
];

const jobTypeMenuItems = [
    <SelectOption key="type-template"  value="job" />,
    <SelectOption key="type-worklow"  value="workflowjob" />,
    <SelectOption key="type-all"  value="All" data-value="all" />
];

const JobExplorer = () => {
    const [ preflightError, setPreFlightError ] = useState(null);
    const [ jobExplorerData, setJobExplorerData ] = useState([]);
    const [ firstRender, setFirstRender ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ meta, setMeta ] = useState({});
    const [ currPage, setCurrPage ] = useState(1);
    const [ statusIsExpanded, setStatusIsExpanded ] = useState(false);
    const [ jobTypeIsExpanded, setJobTypeIsExpanded ] = useState(false);
    const [ filters, setFilters ] = useState({
        status: [ 'successful', 'failed' ],
        type: [ 'job', 'workflowjob' ]
    });
    const {
        queryParams,
        // setId,
        setLimit,
        setOffset,
        setJobType,
        setStatus
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
                ({ items: jobExplorerData = [], meta }) => {
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
                [ readJobExplorer({ params: queryParams }) ]
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

    const onSelect = (type, event, selection) => {
        const checked = event.target.checked;
        setFilters({
            ...filters,
            [type]: checked
                ? [ ...filters[type], selection ]
                : filters[type].filter(value => value !== selection)
        });
    };

    const onStatusSelect = (event, selection) => {
        onSelect('status', event, selection);
        setStatus(filters.status);
    };

    const onJobTypeSelect = (event, selection) => {
        onSelect('type', event, selection);
        console.log(event.target.value);
        setJobType(filters.type);
    };

    const onStatusToggle = () => {
        setStatusIsExpanded(!statusIsExpanded);
    };

    const onJobTypeToggle = () => {
        setJobTypeIsExpanded(!jobTypeIsExpanded);
    };

    const onDelete = (type = '', id = '') => {
        if (type) {
            setFilters({
                ...filters,
                [type.toLowerCase()]: filters[type.toLowerCase()].filter(value => value !== id)
            });
        } else {
            setFilters({
                filters: {
                    status: [],
                    type: []
                }
            });
        }
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
                                        <DataToolbar id="jobs-data-toolbar" clearAllFilters={ onDelete }>
                                            <DataToolbarContent>
                                                <DataToolbarToggleGroup
                                                    toggleIcon={ <FilterIcon /> }
                                                    breakpoint="xl"
                                                >
                                                    <DataToolbarGroup variant="filter-group">
                                                        <DataToolbarFilter
                                                            chips={ filters.status }
                                                            categoryName="Status"
                                                            deleteChip={ onDelete }
                                                        >
                                                            <Select
                                                                variant={ SelectVariant.checkbox }
                                                                aria-label="Status"
                                                                onToggle={ onStatusToggle }
                                                                onSelect={ onStatusSelect }
                                                                selections={ filters.status }
                                                                isExpanded={ statusIsExpanded }
                                                                placeholderText="Status"
                                                            >
                                                                { statusMenuItems }
                                                            </Select>
                                                        </DataToolbarFilter>
                                                        <DataToolbarFilter
                                                            categoryName="Type"
                                                            chips={ filters.type }
                                                            deleteChip={ onDelete }
                                                        >
                                                            <Select
                                                                aria-label="Type"
                                                                variant={ SelectVariant.checkbox }
                                                                onToggle={ onJobTypeToggle }
                                                                onSelect={ onJobTypeSelect }
                                                                selections={ filters.type }
                                                                isExpanded={ jobTypeIsExpanded }
                                                                placeholderText="Job Type"
                                                            >
                                                                { jobTypeMenuItems }
                                                            </Select>
                                                        </DataToolbarFilter>
                                                    </DataToolbarGroup>
                                                </DataToolbarToggleGroup>
                                            </DataToolbarContent>
                                        </DataToolbar>
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
