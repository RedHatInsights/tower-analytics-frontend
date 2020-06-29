<<<<<<< HEAD
<<<<<<< HEAD
/*eslint camelcase: ["error", {allow: ["setStart_Date","setEnd_Date","cluster_id","org_id","job_type","template_id","quick_date_range","sort_by"]}]*/
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
=======
/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react';
>>>>>>> Squashed commit of the following:
=======
/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
>>>>>>> Squashed commit of the following:
=======
import PropTypes from 'prop-types';
>>>>>>> Address breaking changes due to PF4 upgrade.

import { useQueryParams } from '../../Utilities/useQueryParams';
import { formatQueryStrings } from '../../Utilities/formatQueryStrings';

import styled from 'styled-components';
import LoadingState from '../../Components/LoadingState';
import EmptyState from '../../Components/EmptyState';
import NoResults from '../../Components/NoResults';
<<<<<<< HEAD
<<<<<<< HEAD
import ApiErrorState from '../../Components/ApiErrorState';
=======
>>>>>>> Squashed commit of the following:
=======
>>>>>>> Squashed commit of the following:
import {
    preflightRequest,
    readJobExplorer,
    readJobExplorerOptions
} from '../../Api';
import { jobExplorer } from '../../Utilities/constants';
import { Paths } from '../../paths';

import {
    Main,
    PageHeader,
    PageHeaderTitle
} from '@redhat-cloud-services/frontend-components';

import {
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> Squashed commit of the following:
    DataToolbar,
    DataToolbarContent as PFDataToolbarContent,
    DataToolbarFilter,
    DataToolbarToggleGroup,
    DataToolbarGroup as PFDataToolbarGroup,
    DataToolbarItem
} from '@patternfly/react-core/dist/esm/experimental';

import {
=======
>>>>>>> Address breaking changes due to PF4 upgrade.
    FilterIcon,
    CalendarAltIcon,
    QuestionCircleIcon
} from '@patternfly/react-icons';

import {
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> Squashed commit of the following:
=======
>>>>>>> Squashed commit of the following:
=======
    Toolbar,
    ToolbarContent as PFToolbarContent,
    ToolbarFilter,
    ToolbarToggleGroup,
    ToolbarItem,
    ToolbarGroup as PFToolbarGroup,
>>>>>>> Address breaking changes due to PF4 upgrade.
    Badge,
    Card,
    CardBody,
    CardHeader as PFCardHeader,
    Pagination,
<<<<<<< HEAD
<<<<<<< HEAD
    PaginationVariant
} from '@patternfly/react-core';

import JobExplorerList from '../../Components/JobExplorerList';
import FilterableToolbar from '../../Components/Toolbar';

=======
=======
>>>>>>> Squashed commit of the following:
    PaginationVariant,
    Select,
    SelectOption,
    // SelectVariant,
    // DropdownPosition,
    Dropdown,
    DropdownToggle,
    DropdownItem,
    InputGroup,
    InputGroupText,
    TextInput,
    Switch as PFSwitch,
    Tooltip,
    TooltipPosition
} from '@patternfly/react-core';

import JobExplorerList from '../../Components/JobExplorerList';

const ToolbarGroup = styled(PFToolbarGroup)`
  button {
    .pf-c-select__toggle-wrapper {
      flex-wrap: nowrap;
    }
  }
`;
<<<<<<< HEAD
>>>>>>> Squashed commit of the following:
=======
>>>>>>> Squashed commit of the following:
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

<<<<<<< HEAD
<<<<<<< HEAD
const perPageOptions = [
    { title: '5', value: 5 },
    { title: '10', value: 10 },
    { title: '15', value: 15 },
    { title: '20', value: 20 },
    { title: '25', value: 25 }
];

const initialQueryParams = {
    ...jobExplorer.defaultParams,
    attributes: jobExplorer.attributes
=======
=======
>>>>>>> Squashed commit of the following:
const Switch = styled(PFSwitch)`
    &&& {
        margin: 0 15px;
    }
`;

const ToolbarContent = styled(PFToolbarContent)`
    .pf-c-toolbar__content-section {
        justify-content: space-between;
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
<<<<<<< HEAD
>>>>>>> Squashed commit of the following:
=======
>>>>>>> Squashed commit of the following:
};

const initialOptionsParams = {
    attributes: jobExplorer.attributes
};

const JobExplorer = props => {
    const [ preflightError, setPreFlightError ] = useState(null);
<<<<<<< HEAD
<<<<<<< HEAD
    const [ apiError, setApiError ] = useState(null);
=======
>>>>>>> Squashed commit of the following:
=======
>>>>>>> Squashed commit of the following:
    const [ jobExplorerData, setJobExplorerData ] = useState([]);
    const [ firstRender, setFirstRender ] = useState(true);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ meta, setMeta ] = useState({});
    const [ currPage, setCurrPage ] = useState(1);
<<<<<<< HEAD
<<<<<<< HEAD
    const [ orgIds, setOrgIds ] = useState([]);
    const [ clusterIds, setClusterIds ] = useState([]);
    const [ templateIds, setTemplateIds ] = useState([]);
    const [ sortBy, setSortBy ] = useState(null);
=======
=======
>>>>>>> Squashed commit of the following:
    const [ statusIsExpanded, setStatusIsExpanded ] = useState(false);
    const [ dateRangeIsExpanded, setDateRangeIsExpanded ] = useState(false);
    const [ jobTypeIsExpanded, setJobTypeIsExpanded ] = useState(false);
    const [ orgIsExpanded, setOrgIsExpanded ] = useState(false);
    const [ isCategoryExpanded, setIsCategoryExpanded ] = useState(false);
    const [ clusterIsExpanded, setClusterIsExpanded ] = useState(false);
    const [ templateIsExpanded, setTemplateIsExpanded ] = useState(false);
    const [ sortByIsExpanded, setSortByIsExpanded ] = useState(false);
    const [ currentCategory, setCurrentCategory ] = useState('Status');

    const [ orgIds, setOrgIds ] = useState([]);
    const [ clusterIds, setClusterIds ] = useState([]);
    const [ templateIds, setTemplateIds ] = useState([]);
    const [ sortBy, setSortBy ] = useState([]);
<<<<<<< HEAD
>>>>>>> Squashed commit of the following:
    const [ statuses, setStatuses ] = useState([]);
    const [ jobTypes, setJobTypes ] = useState([]);
    const [ quickDateRanges, setQuickDateRanges ] = useState([]);
    const [ width, setWidth ] = useState(window.innerWidth);
=======
    const [ statuses, setStatuses ] = useState([]);
    const [ jobTypes, setJobTypes ] = useState([]);
    const [ quickDateRanges, setQuickDateRanges ] = useState([]);
>>>>>>> Squashed commit of the following:

    const { parse } = formatQueryStrings({});
    const {
        location: { search }
    } = props;
    let initialSearchParams = parse(search, { arrayFormat: 'bracket' });
<<<<<<< HEAD
<<<<<<< HEAD
    let combined = { ...initialQueryParams, ...initialSearchParams };
=======
    let combined = { ...initialSearchParams, ...initialQueryParams };
>>>>>>> Squashed commit of the following:
=======
    let combined = { ...initialSearchParams, ...initialQueryParams };
>>>>>>> Squashed commit of the following:
    const {
        queryParams,
        setLimit,
        setOffset,
        setJobType,
        setOrg,
        setStatus,
        setCluster,
        setTemplate,
        setSortBy2,
        setQuickDateRange,
        setRootWorkflowsAndJobs,
        setStart_Date,
        setEnd_Date
    } = useQueryParams(combined);
    const { queryParams: optionsQueryParams } = useQueryParams(
        initialOptionsParams
    );

    const formattedArray = datum => {
        if (Array.isArray(datum)) {
            return [ ...datum ];
        } else {
            return datum.split();
        }
    };

    const [ filters, setFilters ] = useState({
        status: queryParams.status
            ? formattedArray(queryParams.status)
            : [ 'successful', 'failed' ],
        type: queryParams.job_type
            ? formattedArray(queryParams.job_type)
            : [ 'job', 'workflowjob' ],
        org: queryParams.org_id ? formattedArray(queryParams.org_id) : [],
        cluster: queryParams.cluster_id ? formattedArray(queryParams.cluster_id) : [],
        template: queryParams.template_id ? formattedArray(queryParams.template_id) : [],
<<<<<<< HEAD
<<<<<<< HEAD
        sortby: queryParams.sort_by ? queryParams.sort_by : null,
        startDate: queryParams.start_date ? queryParams.start_date : null,
        endDate: queryParams.end_date ? queryParams.end_date : null,
        date: queryParams.quick_date_range ? queryParams.quick_date_range : 'last_30_days',
=======
=======
>>>>>>> Squashed commit of the following:
        sortby: queryParams.sort_by ? formattedArray(queryParams.sort_by) : [],
        startDate: queryParams.start_date ? queryParams.start_date : null,
        endDate: queryParams.end_date ? queryParams.end_date : null,
        date: queryParams.quick_date_range ? queryParams.quick_date_range : null,
<<<<<<< HEAD
>>>>>>> Squashed commit of the following:
=======
>>>>>>> Squashed commit of the following:
        showRootWorkflows: queryParams.only_root_workflows_and_standalone_jobs ? queryParams.only_root_workflows_and_standalone_jobs : false
    });
    const updateURL = () => {
        const { jobExplorer } = Paths;
        const { strings, stringify } = formatQueryStrings(queryParams);
        const search = stringify(strings);
        props.history.push({
            pathname: jobExplorer,
            search
        });
    };

    useEffect(() => {
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======

>>>>>>> Squashed commit of the following:
=======
>>>>>>> Add paginationParams to request URL for job explorer endpoint.
=======

>>>>>>> Squashed commit of the following:
        insights.chrome.appNavClick({ id: 'job-explorer', secondaryNav: true });
        updateURL();
    }, []);

    useEffect(() => {
        if (firstRender) {
            return;
        }

        const getData = () => {
            return Promise.all([ readJobExplorer({ params: queryParams }) ]);
        };

        const update = async () => {
<<<<<<< HEAD
<<<<<<< HEAD
            setApiError(null);
=======
>>>>>>> Squashed commit of the following:
=======
>>>>>>> Squashed commit of the following:
            setIsLoading(true);
            await window.insights.chrome.auth.getUser();
            getData().then(([{ items: jobExplorerData = [], meta }]) => {
                setJobExplorerData(jobExplorerData);
                setMeta(meta);
<<<<<<< HEAD
<<<<<<< HEAD
            }).catch(e => setApiError(e.error)
            ).finally(() => setIsLoading(false));
=======
                setIsLoading(false);
            });
>>>>>>> Squashed commit of the following:
=======
                setIsLoading(false);
            });
>>>>>>> Squashed commit of the following:
        };

        update();
        updateURL();
    }, [ queryParams ]);

    useEffect(() => {
        if (firstRender) {
            return;
        }

        if (filters.type) {
            setJobType(filters.type);
        }

        if (filters.status) {
            setStatus(filters.status);
        }

        if (filters.org) {
            setOrg(filters.org);
        }

        if (filters.cluster) {
            setCluster(filters.cluster);
        }

        if (filters.template) {
            setTemplate(filters.template);
        }

<<<<<<< HEAD
<<<<<<< HEAD
        // The filter can change back to null too.
        setSortBy2(filters.sortby);
=======
        if (filters.sortby) {
            setSortBy2(filters.sortby);
        }
>>>>>>> Squashed commit of the following:
=======
        if (filters.sortby) {
            setSortBy2(filters.sortby);
        }
>>>>>>> Squashed commit of the following:

        setRootWorkflowsAndJobs(filters.showRootWorkflows);

        setQuickDateRange(filters.date);

<<<<<<< HEAD
<<<<<<< HEAD
        if (filters.date !== 'custom') {
            setStart_Date(null);
            setEnd_Date(null);
        } else {
            setStart_Date(filters.startDate);
            setEnd_Date(filters.endDate);
        }
=======
        setStart_Date(filters.startDate);

        setEnd_Date(filters.endDate);
>>>>>>> Squashed commit of the following:
=======
        setStart_Date(filters.startDate);

        setEnd_Date(filters.endDate);
>>>>>>> Squashed commit of the following:
    }, [ filters ]);

    useEffect(() => {
        let ignore = false;

        const fetchEndpoints = () => {
            return Promise.all(
                [
                    readJobExplorer({ params: queryParams }),
                    readJobExplorerOptions({ params: optionsQueryParams })
                ].map(p => p.catch(() => []))
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
                    { items: jobExplorerData = [], meta },
                    {
                        cluster_id,
                        org_id,
                        job_type,
                        status,
                        template_id,
                        quick_date_range,
                        sort_by
                    }
                ]) => {
                    if (!ignore) {
                        setJobExplorerData(jobExplorerData);
                        setMeta(meta);
                        setClusterIds(cluster_id);
                        setOrgIds(org_id);
                        setTemplateIds(template_id);
                        setSortBy(sort_by);
                        setStatuses(status);
                        setJobTypes(job_type);
                        setQuickDateRanges(quick_date_range);
                        setFirstRender(false);
                        setIsLoading(false);
                    }
                }
            );
        }

        initializeWithPreflight();
        updateURL();

        return () => (ignore = true);
    }, []);

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> Squashed commit of the following:
    const handleChips = (item, comparator) => {
        return item.reduce((acc, i) => {
            Number.isInteger(parseInt(i)) ? (i = parseInt(i)) : i;
            comparator.forEach(item => {
                if (item.key === i) {
                    acc.push(item.value);
                }
            });
            return acc;
        }, []);
    };

    const handleDateChips = (date, comparator) => {
        if (date && typeof date === 'string') {
            let val;
            comparator.forEach(i => {
                if (i.key === date) {
                    val = i.value;
                }
            });
            return new Array(val);
        }

        return new Array();
    };

<<<<<<< HEAD
>>>>>>> Squashed commit of the following:
=======
    useEffect(() => {
        window.addEventListener('resize', () => setWidth(window.innerWidth));

        return () => window.removeEventListener('resize', () => setWidth(null));
    }, []);

>>>>>>> Handle long dropdowns by setting max height. Use compact datalist. Conditionally render datacell item labels when widnow is mobile sized. Remove datalist headers when window is mobile size.
=======
>>>>>>> Squashed commit of the following:
    const onDelete = (type, val) => {
        let filtered;
        Number.isInteger(val) ? (val = parseInt(val)) : val;

        if (type === 'Status') {
            filtered = statuses.filter(status => status.value === val);
        }

        if (type === 'Type') {
            filtered = jobTypes.filter(job => job.value === val);
        }

        if (type === 'Org') {
            filtered = orgIds.filter(org => org.value === val);
        }

        if (type === 'Cluster') {
            filtered = clusterIds.filter(cluster => cluster.value === val);
        }

        if (type === 'Template') {
            filtered = templateIds.filter(template => template.value === val);
        }

<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> Squashed commit of the following:
        if (type === 'SortBy') {
            filtered = sortBy.filter(attr => attr.value === val);
        }

<<<<<<< HEAD
>>>>>>> Squashed commit of the following:
=======
>>>>>>> Squashed commit of the following:
        if (type) {
            if (type === 'Date') {
                setFilters({
                    ...filters,
                    date: null,
                    startDate: null,
                    endDate: null
                });
<<<<<<< HEAD
<<<<<<< HEAD
            } else if (type === 'SortBy') {
                setFilters({
                    ...filters,
                    sortby: null
                });
=======
>>>>>>> Squashed commit of the following:
=======
>>>>>>> Squashed commit of the following:
            } else {
                setFilters({
                    ...filters,
                    [type.toLowerCase()]: filters[type.toLowerCase()].filter(
                        value => value !== filtered[0].key.toString()
                    )
                });
            }
        } else {
            setFilters({
                status: [],
                type: [],
                org: [],
                cluster: [],
                template: [],
<<<<<<< HEAD
<<<<<<< HEAD
                sortby: null,
                date: null,
                startDate: null,
                endDate: null,
                showRootWorkflows: false
=======
=======
>>>>>>> Squashed commit of the following:
                sortby: [],
                date: null,
                startDate: null,
<<<<<<< HEAD
                endDate: null
<<<<<<< HEAD
>>>>>>> Squashed commit of the following:
=======
>>>>>>> Squashed commit of the following:
=======
                endDate: null,
                showRootWorkflows: false
>>>>>>> Address breaking changes due to PF4 upgrade.
            });
        }
    };

<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> Squashed commit of the following:
    const buildCategoryDropdown = () => {
        return (
            <ToolbarItem>
                <Dropdown
                    onSelect={ e => {
                        setCurrentCategory(e.target.innerText);
                        setIsCategoryExpanded(!isCategoryExpanded);
                    } }
                    position={ 'left' }
                    toggle={
                        <DropdownToggle
                            onToggle={ () => {
                                setIsCategoryExpanded(!isCategoryExpanded);
                            } }
                            style={ { width: '100%' } }
                        >
                            <FilterIcon />
              &nbsp;{ currentCategory }
                        </DropdownToggle>
                    }
                    isOpen={ isCategoryExpanded }
                    dropdownItems={ [
                        <DropdownItem key="cat0">Status</DropdownItem>,
                        <DropdownItem key="cat6">Date</DropdownItem>,
                        <DropdownItem key="cat1">Job type</DropdownItem>,
                        <DropdownItem key="cat2">Organization</DropdownItem>,
                        <DropdownItem key="cat3">Cluster</DropdownItem>,
                        <DropdownItem key="cat4">Template</DropdownItem>,
                        <DropdownItem key="cat5">Sort by</DropdownItem>
                    ] }
                    style={ { width: '100%' } }
                />
            </ToolbarItem>
        );
    };

    const buildFilterDropdown = () => {
        const organizationIdMenuItems = orgIds.map(({ key, value }) => (
            <SelectOption key={ key } value={ `${key}` }>
                { value }
            </SelectOption>
        ));

        const statusMenuItems = statuses.map(({ key, value }) => (
            <SelectOption key={ key } value={ key }>
                { value }
            </SelectOption>
        ));

        const jobTypeMenuItems = jobTypes.map(({ key, value }) => (
            <SelectOption key={ key } value={ key }>
                { value }
            </SelectOption>
        ));

        const clusterIdMenuItems = clusterIds.map(({ key, value }) => (
            <SelectOption key={ key } value={ `${key}` }>
                { value }
            </SelectOption>
        ));

        const templateIdMenuItems = templateIds.map(({ key, value }) => (
            <SelectOption key={ key } value={ `${key}` }>
                { value }
            </SelectOption>
        ));

        const sortByMenuItems = sortBy.map(({ key, value }) => (
            <SelectOption key={ key } value={ key }>
                { value }
            </SelectOption>
        ));

        const dateRangeMenuItems = quickDateRanges.map(({ key, value }) => (
            <SelectOption key={ key } value={ key }>
                { value }
            </SelectOption>
        ));

        const onSelect = (type, event, selection) => {
            const checked = event.target.checked;

            setFilters({
                ...filters,
                [type]: checked
                    ? [ ...filters[type], selection ]
                    : filters[type].filter(value => value !== selection)
            });
        };

        const onDateSelect = (_event, selection) => {
            setFilters({
                ...filters,
                date: selection
            });
            setDateRangeIsExpanded(!dateRangeIsExpanded);
        };

        return (
            <React.Fragment>
                <ToolbarFilter
                    showToolbarItem={ currentCategory === 'Status' }
                    chips={ handleChips(filters.status, statuses) }
                    categoryName="Status"
                    deleteChip={ onDelete }
                >
                    <Select
                        isOpen={ statusIsExpanded }
                        variant={ 'checkbox' }
                        aria-label="Status"
                        onToggle={ () => {
                            setStatusIsExpanded(!statusIsExpanded);
                        } }
                        onSelect={ (event, selection) => {
                            onSelect('status', event, selection);
                        } }
                        selections={ filters.status }
                        isExpanded={ statusIsExpanded }
                        placeholderText="Filter by job status"
                    >
                        { statusMenuItems }
                    </Select>
                </ToolbarFilter>
                <ToolbarFilter
                    showToolbarItem={ currentCategory === 'Date' }
                    categoryName="Date"
                    chips={ handleDateChips(filters.date, quickDateRanges) }
                    deleteChip={ onDelete }
                >
                    <Select
                        isOpen={ dateRangeIsExpanded }
                        variant={ 'single' }
                        aria-label="Date"
                        onToggle={ () => {
                            setDateRangeIsExpanded(!dateRangeIsExpanded);
                        } }
                        onSelect={ (event, selection) => {
                            onDateSelect(event, selection);
                        } }
                        selections={ filters.date }
                        isExpanded={ dateRangeIsExpanded }
                        placeholderText="Filter by date range"
                    >
                        { dateRangeMenuItems }
                    </Select>
                </ToolbarFilter>
                <ToolbarFilter
                    showToolbarItem={ currentCategory === 'Job type' }
                    categoryName="Type"
                    chips={ handleChips(filters.type, jobTypes) }
                    deleteChip={ onDelete }
                >
                    <Select
                        isOpen={ jobTypeIsExpanded }
                        aria-label="Type"
                        variant={ 'checkbox' }
                        onToggle={ () => {
                            setJobTypeIsExpanded(!jobTypeIsExpanded);
                        } }
                        onSelect={ (event, selection) => {
                            onSelect('type', event, selection);
                        } }
                        selections={ filters.type }
                        isExpanded={ jobTypeIsExpanded }
                        placeholderText="Filter by job type"
                    >
                        { jobTypeMenuItems }
                    </Select>
                </ToolbarFilter>
                <ToolbarFilter
                    showToolbarItem={ currentCategory === 'Organization' }
                    categoryName="Org"
                    chips={ handleChips(filters.org, orgIds) }
                    deleteChip={ onDelete }
                >
                    <Select
                        isOpen={ orgIsExpanded }
                        aria-label="Filter by Org"
                        variant={ 'checkbox' }
                        onToggle={ () => {
                            setOrgIsExpanded(!orgIsExpanded);
                        } }
                        onSelect={ (event, selection) => {
                            onSelect('org', event, selection);
                        } }
                        selections={ filters.org }
                        isExpanded={ orgIsExpanded }
                        placeholderText="Filter by organization"
                    >
                        { organizationIdMenuItems }
                    </Select>
                </ToolbarFilter>
                <ToolbarFilter
                    showToolbarItem={ currentCategory === 'Cluster' }
                    categoryName="Cluster"
                    chips={ handleChips(filters.cluster, clusterIds) }
                    deleteChip={ onDelete }
                >
                    <Select
                        isOpen={ clusterIsExpanded }
                        aria-label="Filter by Cluster"
                        variant={ 'checkbox' }
                        onToggle={ () => {
                            setClusterIsExpanded(!clusterIsExpanded);
                        } }
                        onSelect={ (event, selection) => {
                            onSelect('cluster', event, selection);
                        } }
                        selections={ filters.cluster }
                        isExpanded={ clusterIsExpanded }
                        placeholderText="Filter by cluster"
                    >
                        { clusterIdMenuItems }
                    </Select>
                </ToolbarFilter>
                <ToolbarFilter
                    showToolbarItem={ currentCategory === 'Template' }
                    categoryName="Template"
                    chips={ handleChips(filters.template, templateIds) }
                    deleteChip={ onDelete }
                >
                    <Select
                        isOpen={ templateIsExpanded }
                        aria-label="Filter by template"
                        variant={ 'checkbox' }
                        onToggle={ () => setTemplateIsExpanded(!templateIsExpanded) }
                        onSelect={ (event, selection) => {
                            onSelect('template', event, selection);
                        } }
                        selections={ filters.template }
                        isExpanded={ templateIsExpanded }
                        placeholderText="Filter by template"
                    >
                        { templateIdMenuItems }
                    </Select>
                </ToolbarFilter>
                <ToolbarFilter
                    showToolbarItem={ currentCategory === 'Sort by' }
                    categoryName="SortBy"
                    chips={ handleChips(filters.sortby, sortBy) }
                    deleteChip={ onDelete }
                >
                    <Select
                        isOpen={ sortByIsExpanded }
                        aria-label="Sort by"
                        variant={ 'checkbox' }
                        onToggle={ () => {
                            setSortByIsExpanded(!sortByIsExpanded);
                        } }
                        onSelect={ (event, selection) => {
                            onSelect('sortby', event, selection);
                        } }
                        selections={ filters.sortby }
                        isExpanded={ sortByIsExpanded }
                        placeholderText="Sort by attribute"
                    >
                        { sortByMenuItems }
                    </Select>
                </ToolbarFilter>
            </React.Fragment>
        );
    };

<<<<<<< HEAD
>>>>>>> Squashed commit of the following:
=======
>>>>>>> Squashed commit of the following:
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

<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> Squashed commit of the following:
    const handleStartDate = e => {
        setFilters({
            ...filters,
            startDate: e
        });
    };

    const handleEndDate = e => {
        setFilters({
            ...filters,
            endDate: e
        });
    };

<<<<<<< HEAD
>>>>>>> Squashed commit of the following:
=======
>>>>>>> Squashed commit of the following:
    return (
        <React.Fragment>
            <PageHeader>
                <PageHeaderTitle title={ title } />
            </PageHeader>

            { preflightError && (
                <Main>
                    <EmptyState { ...preflightError } />
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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
                      <FilterableToolbar
                          orgs={ orgIds }
                          statuses={ statuses }
                          clusters={ clusterIds }
                          templates={ templateIds }
                          types={ jobTypes }
                          sortables={ sortBy }
                          dateRanges={ quickDateRanges }
                          onDelete={ onDelete }
                          passedFilters={ filters }
                          handleFilters={ setFilters }
                      />
                      { apiError && <ApiErrorState message={ apiError } /> }
                      { !apiError && isLoading && <LoadingState /> }
                      { !apiError && !isLoading && jobExplorerData.length <= 0 && <NoResults /> }
                      { !apiError && !isLoading && jobExplorerData.length > 0 && (
=======
=======
>>>>>>> Squashed commit of the following:
                      <DataToolbar
=======
                      <Toolbar
>>>>>>> Address breaking changes due to PF4 upgrade.
                          id="data-toolbar-with-chip-groups"
                          clearAllFilters={ onDelete }
                          collapseListedFiltersBreakpoint="xl"
                      >
                          <ToolbarContent>
                              <ToolbarToggleGroup
                                  toggleIcon={ <FilterIcon /> }
                                  breakpoint="xl"
                              >
                                  { quickDateRanges.length > 0 && (
                                      <ToolbarGroup variant="filter-group">
                                          { buildCategoryDropdown() }
                                          { buildFilterDropdown() }
                                          { filters.date === 'custom' && (
                            <>
                              <InputGroup>
                                  <InputGroupText
                                      component="label"
                                      htmlFor="startDate"
                                  >
                                      <CalendarAltIcon />
                                  </InputGroupText>
                                  <TextInput
                                      name="startDate"
                                      id="startDate"
                                      type="date"
                                      aria-label="Start Date"
                                      value={ filters.startDate }
                                      onChange={ e => handleStartDate(e) }
                                  />
                              </InputGroup>
                              <InputGroup>
                                  <InputGroupText
                                      component="label"
                                      htmlFor="endDate"
                                  >
                                      <CalendarAltIcon />
                                  </InputGroupText>
                                  <TextInput
                                      name="endDate"
                                      id="endDate"
                                      type="date"
                                      aria-label="End Date"
                                      value={ filters.endDate }
                                      onChange={ e => handleEndDate(e) }
                                  />
                              </InputGroup>
                            </>
                                          ) }
                                      </ToolbarGroup>
                                  ) }
                              </ToolbarToggleGroup>
                              <div>
                                  <Switch
                                      id="showRootWorkflowJobs"
                                      label="Ignore nested workflows and jobs"
                                      labelOff="Ignore nested workflows and jobs"
                                      isChecked={ filters.showRootWorkflows }
                                      onChange={ val => {
                                          setFilters({
                                              ...filters,
                                              showRootWorkflows: val
                                          });
                                      } }
                                  />
                                  <Tooltip
                                      position={ TooltipPosition.top }
                                      content={
                                          <div>
                                              { ' ' }
                                    If enabled, nested workflows and jobs
                                    will not be included in the overall totals.
                                    Enable this option to filter out duplicate entries.
                                          </div>
                                      }
                                  >
                                      <QuestionCircleIcon />
                                  </Tooltip>
                              </div>
                          </ToolbarContent>
                      </Toolbar>
                      { isLoading && <LoadingState /> }
                      { !isLoading && jobExplorerData.length <= 0 && <NoResults /> }
                      { !isLoading && jobExplorerData.length > 0 && (
<<<<<<< HEAD
>>>>>>> Squashed commit of the following:
                  <>
                    <JobExplorerList jobs={ jobExplorerData } windowWidth={ width } />
=======
                  <>
                    <JobExplorerList jobs={ jobExplorerData } />
>>>>>>> Squashed commit of the following:
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

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> Address breaking changes due to PF4 upgrade.
JobExplorer.propTypes = {
    location: PropTypes.object,
    history: PropTypes.object
};

<<<<<<< HEAD
=======
>>>>>>> Squashed commit of the following:
=======
>>>>>>> Squashed commit of the following:
=======
>>>>>>> Address breaking changes due to PF4 upgrade.
export default JobExplorer;
