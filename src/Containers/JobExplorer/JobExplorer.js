/*eslint camelcase: ["error", {allow: ["setStart_Date","setEnd_Date","cluster_id","org_id","job_type","template_id","quick_date_range","sort_by"]}]*/
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { useQueryParams } from '../../Utilities/useQueryParams';
import { formatQueryStrings } from '../../Utilities/formatQueryStrings';

import styled from 'styled-components';
import LoadingState from '../../Components/LoadingState';
import EmptyState from '../../Components/EmptyState';
import NoResults from '../../Components/NoResults';
import ApiErrorState from '../../Components/ApiErrorState';
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
    Card,
    CardBody,
    CardHeader as PFCardHeader,
    Pagination as PFPagination,
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

const CompactPagination = styled(PFPagination)`
  display: flex;
  align-items: flex-start;
  margin: 0;
`;

const Pagination = styled(PFPagination)`
  margin-top: 20px;
`;

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
};

const initialOptionsParams = {
    attributes: jobExplorer.attributes
};

const JobExplorer = props => {
    const [ preflightError, setPreFlightError ] = useState(null);
    const [ apiError, setApiError ] = useState(null);
    const [ jobExplorerData, setJobExplorerData ] = useState([]);
    const [ firstRender, setFirstRender ] = useState(true);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ meta, setMeta ] = useState({});
    const [ currPage, setCurrPage ] = useState(1);
    const [ orgIds, setOrgIds ] = useState([]);
    const [ clusterIds, setClusterIds ] = useState([]);
    const [ templateIds, setTemplateIds ] = useState([]);
    const [ sortBy, setSortBy ] = useState(null);
    const [ statuses, setStatuses ] = useState([]);
    const [ jobTypes, setJobTypes ] = useState([]);
    const [ quickDateRanges, setQuickDateRanges ] = useState([]);

    const { parse } = formatQueryStrings({});
    const {
        location: { search }
    } = props;
    let initialSearchParams = parse(search, { arrayFormat: 'bracket' });
    let combined = { ...initialQueryParams, ...initialSearchParams };
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
        job: queryParams.job_type
            ? formattedArray(queryParams.job_type)
            : [ 'job', 'workflowjob' ],
        organization: queryParams.org_id ? formattedArray(queryParams.org_id) : [],
        cluster: queryParams.cluster_id ? formattedArray(queryParams.cluster_id) : [],
        template: queryParams.template_id ? formattedArray(queryParams.template_id) : [],
        sortBy: queryParams.sort_by ? queryParams.sort_by : null,
        startDate: queryParams.start_date ? queryParams.start_date : null,
        endDate: queryParams.end_date ? queryParams.end_date : null,
        date: queryParams.quick_date_range ? queryParams.quick_date_range : 'last_30_days',
        showRootWorkflows: queryParams.only_root_workflows_and_standalone_jobs === 'true' ? true : false
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
            setApiError(null);
            setIsLoading(true);
            await window.insights.chrome.auth.getUser();
            getData().then(([{ items: jobExplorerData = [], meta }]) => {
                setJobExplorerData(jobExplorerData);
                setMeta(meta);
            }).catch(e => setApiError(e.error)
            ).finally(() => setIsLoading(false));
        };

        update();
        updateURL();
    }, [ queryParams ]);

    useEffect(() => {
        if (firstRender) {
            return;
        }

        if (filters.job) {
            setJobType(filters.job);
        }

        if (filters.status) {
            setStatus(filters.status);
        }

        if (filters.organization) {
            setOrg(filters.organization);
        }

        if (filters.cluster) {
            setCluster(filters.cluster);
        }

        if (filters.template) {
            setTemplate(filters.template);
        }

        // The filter can change back to null too.
        setSortBy2(filters.sortBy);

        setRootWorkflowsAndJobs(filters.showRootWorkflows);

        setQuickDateRange(filters.date);

        if (filters.date !== 'custom') {
            setStart_Date(null);
            setEnd_Date(null);
        } else {
            setStart_Date(filters.startDate);
            setEnd_Date(filters.endDate);
        }
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

        if (type === 'Job') {
            filtered = jobTypes.filter(job => job.value === val);
        }

        if (type === 'Organization') {
            filtered = orgIds.filter(org => org.value === val);
        }

        if (type === 'Cluster') {
            filtered = clusterIds.filter(cluster => cluster.value === val);
        }

        if (type === 'Template') {
            filtered = templateIds.filter(template => template.value === val);
        }

        if (type) {
            if (type === 'Date') {
                setFilters({
                    ...filters,
                    date: null,
                    startDate: null,
                    endDate: null
                });
            } else if (type === 'SortBy') {
                setFilters({
                    ...filters,
                    sortBy: null
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
                job: [],
                organization: [],
                cluster: [],
                template: [],
                sortBy: null,
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
                <span style={ { margin: '0 10px' } }>|</span> Jobs explorer
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
                  </CardHeader>
                  <CardBody>
                      <FilterableToolbar
                          categories={ {
                              organization: orgIds,
                              cluster: clusterIds,
                              status: statuses,
                              job: jobTypes,
                              template: templateIds,
                              sortBy,
                              date: quickDateRanges
                          } }
                          onDelete={ onDelete }
                          filters={ filters }
                          setFilters={ setFilters }
                      />
                      <CompactPagination
                          itemCount={ meta.count ? meta.count : 0 }
                          widgetId="pagination-options-menu-top"
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
                          isCompact
                      />
                      { apiError && <ApiErrorState message={ apiError } /> }
                      { !apiError && isLoading && <LoadingState /> }
                      { !apiError && !isLoading && jobExplorerData.length <= 0 && <NoResults /> }
                      { !apiError && !isLoading && jobExplorerData.length > 0 && (
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

