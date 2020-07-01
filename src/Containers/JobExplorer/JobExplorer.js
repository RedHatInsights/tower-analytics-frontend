/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { useQueryParams } from '../../Utilities/useQueryParams';
import { formatQueryStrings } from '../../Utilities/formatQueryStrings';

import styled from 'styled-components';
import LoadingState from '../../Components/LoadingState';
import EmptyState from '../../Components/EmptyState';
import NoResults from '../../Components/NoResults';
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
    Badge,
    Card,
    CardBody,
    CardHeader as PFCardHeader,
    Pagination,
    PaginationVariant
} from '@patternfly/react-core';

import JobExplorerList from '../../Components/JobExplorerList';
import FilterableToolbar from '../../Components/Toolbar';

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

const initialOptionsParams = {
    attributes: jobExplorer.attributes
};

const JobExplorer = props => {
    const [ preflightError, setPreFlightError ] = useState(null);
    const [ jobExplorerData, setJobExplorerData ] = useState([]);
    const [ firstRender, setFirstRender ] = useState(true);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ meta, setMeta ] = useState({});
    const [ currPage, setCurrPage ] = useState(1);
    const [ orgIds, setOrgIds ] = useState([]);
    const [ clusterIds, setClusterIds ] = useState([]);
    const [ templateIds, setTemplateIds ] = useState([]);
    const [ sortBy, setSortBy ] = useState([]);
    const [ statuses, setStatuses ] = useState([]);
    const [ jobTypes, setJobTypes ] = useState([]);
    const [ quickDateRanges, setQuickDateRanges ] = useState([]);

    const { parse } = formatQueryStrings({});
    const {
        location: { search }
    } = props;
    let initialSearchParams = parse(search, { arrayFormat: 'bracket' });
    let combined = { ...initialSearchParams, ...initialQueryParams };
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
        sortby: queryParams.sort_by ? formattedArray(queryParams.sort_by) : [],
        startDate: queryParams.start_date ? queryParams.start_date : null,
        endDate: queryParams.end_date ? queryParams.end_date : null,
        date: queryParams.quick_date_range ? queryParams.quick_date_range : null,
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
            setIsLoading(true);
            await window.insights.chrome.auth.getUser();
            getData().then(([{ items: jobExplorerData = [], meta }]) => {
                setJobExplorerData(jobExplorerData);
                setMeta(meta);
                setIsLoading(false);
            });
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

        if (filters.sortby) {
            setSortBy2(filters.sortby);
        }

        setRootWorkflowsAndJobs(filters.showRootWorkflows);

        setQuickDateRange(filters.date);

        setStart_Date(filters.startDate);

        setEnd_Date(filters.endDate);
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

        if (type === 'SortBy') {
            filtered = sortBy.filter(attr => attr.value === val);
        }

        if (type) {
            if (type === 'Date') {
                setFilters({
                    ...filters,
                    date: null,
                    startDate: null,
                    endDate: null
                });
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
                sortby: [],
                date: null,
                startDate: null,
                endDate: null,
                showRootWorkflows: false
            });
        }
    };

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
                      { isLoading && <LoadingState /> }
                      { !isLoading && jobExplorerData.length <= 0 && <NoResults /> }
                      { !isLoading && jobExplorerData.length > 0 && (
                  <>
                    <JobExplorerList jobs={ jobExplorerData } />
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

JobExplorer.propTypes = {
    location: PropTypes.object,
    history: PropTypes.object
};

export default JobExplorer;
