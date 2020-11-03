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
    PaginationVariant,
    Title
} from '@patternfly/react-core';

import JobExplorerList from '../../Components/JobExplorerList';
import FilterableToolbar from '../../Components/Toolbar/';

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
        urlMappedQueryParams,
        setLimit,
        setOffset,
        setFromToolbar
    } = useQueryParams(combined);
    const { queryParams: optionsQueryParams } = useQueryParams(
        initialOptionsParams
    );

    const updateURL = () => {
        const { jobExplorer } = Paths;
        const { strings, stringify } = formatQueryStrings(urlMappedQueryParams);
        const search = stringify(strings);
        props.history.push({
            pathname: jobExplorer,
            search
        });
    };

    useEffect(() => {
        // Click on the nav -> this causes the page rerender if already not clicked
        insights.chrome.appNavClick({ id: 'job-explorer', secondaryNav: true });
        updateURL();

        async function initializeWithPreflight() {
            setIsLoading(true);
            await window.insights.chrome.auth.getUser();
            await preflightRequest().catch(error => {
                setPreFlightError({ preflightError: error });
            });
            readJobExplorerOptions({ params: optionsQueryParams })
            .then(
                ({
                    cluster_id,
                    org_id,
                    job_type,
                    status,
                    template_id,
                    quick_date_range,
                    sort_by
                }) => {
                    setClusterIds(cluster_id);
                    setOrgIds(org_id);
                    setTemplateIds(template_id);
                    setSortBy(sort_by);
                    setStatuses(status);
                    setJobTypes(job_type);
                    setQuickDateRanges(quick_date_range);
                })
            .catch(e => setApiError(e.error))
            .finally(() => setIsLoading(false));
        }

        initializeWithPreflight();
        updateURL();
    }, []);

    useEffect(() => {
        const update = async () => {
            setApiError(null);
            setIsLoading(true);
            await window.insights.chrome.auth.getUser();
            readJobExplorer({ params: urlMappedQueryParams })
            .then(({ items: jobExplorerData = [], meta }) => {
                setJobExplorerData(jobExplorerData);
                setMeta(meta);
            }).catch(e => setApiError(e.error)
            ).finally(() => setIsLoading(false));
        };

        update();
        updateURL();
    }, [ queryParams ]);

    const returnOffsetVal = page => {
        let offsetVal = (page - 1) * queryParams.limit;
        return offsetVal;
    };

    const title = (
        <Title headingLevel="h1">
          Job Explorer
        </Title>
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
                              status: statuses,
                              quickDateRange: quickDateRanges,
                              jobType: jobTypes,
                              orgId: orgIds,
                              clusterId: clusterIds,
                              templateId: templateIds,
                              sortBy
                          } }
                          filters={ queryParams }
                          setFilters={ setFromToolbar }
                          pagination={
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
                          }
                          hasSettings
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
