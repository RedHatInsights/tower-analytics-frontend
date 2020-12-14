import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
    parse
    // stringify
} from 'query-string';

import { useQueryParams } from '../../Utilities/useQueryParams';
import useFetch from '../../Utilities/useFetch';
import { keysToCamel } from '../../Utilities/helpers';

import LoadingState from '../../Components/LoadingState';
import NoResults from '../../Components/NoResults';
import ApiErrorState from '../../Components/ApiErrorState';
import {
    // preflightRequest,
    readJobExplorer,
    readJobExplorerOptions
} from '../../Api';
import { jobExplorer } from '../../Utilities/constants';

import {
    Main,
    PageHeader,
    PageHeaderTitle
} from '@redhat-cloud-services/frontend-components';

import {
    Card,
    CardBody,
    Pagination,
    PaginationVariant
} from '@patternfly/react-core';

import JobExplorerList from '../../Components/JobExplorerList';
import FilterableToolbar from '../../Components/Toolbar/';

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

const JobExplorer = ({
    location: { search }
    // history
}) => {
    // const [ preflightError, setPreFlightError ] = useState(null);
    const [ currPage, setCurrPage ] = useState(1);

    let initialSearchParams = keysToCamel(
        parse(search, { arrayFormat: 'bracket' })
    );
    let combined = { ...initialQueryParams, ...initialSearchParams };
    const {
        queryParams,
        urlMappedQueryParams,
        setLimit,
        setOffset,
        setFromToolbar
    } = useQueryParams(combined);

    const {
        result: { jobExplorerData, meta },
        error: jobsError,
        isLoading: isJobExplorerLoading,
        request: fetchJobExplorer
    } = useFetch(
        useCallback(async params => {
            const [ jobs ] = await Promise.all([ readJobExplorer({ params }) ]);
            return {
                jobExplorerData: jobs.items,
                meta: jobs.meta
            };
        }, []),
        {
            jobExplorerData: [],
            meta: {}
        }
    );

    const {
        result: { options },
        error: optionsError,
        isLoading: isJobExplorerOptionsLoading,
        request: fetchJobExplorerOptions
    } = useFetch(
        useCallback(async () => {
            const [ options ] = await Promise.all([
                readJobExplorerOptions({ params: urlMappedQueryParams })
            ]);
            /* eslint-disable-next-line */
      const { attributes, groupBy, ...rest } = keysToCamel(options);
            return {
                options: keysToCamel(rest)
            };
        }, []),
        {
            options: {}
        }
    );

    useEffect(() => {
        insights.chrome.appNavClick({ id: 'job-explorer', secondaryNav: true });
    }, []);

    useEffect(() => {
        fetchJobExplorerOptions();
    }, [ fetchJobExplorerOptions ]);

    useEffect(() => {
        fetchJobExplorer(urlMappedQueryParams);
    }, [ queryParams ]);

    const returnOffsetVal = page => (page - 1) * queryParams.limit;

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
    <>
      <PageHeader>
          <PageHeaderTitle title={ 'Job Explorer' } />
      </PageHeader>
      <Main>
          <Card>
              <CardBody>
                  <FilterableToolbar
                      categories={ options }
                      filters={ queryParams }
                      setFilters={ setFromToolbar }
                      pagination={
                          <Pagination
                              itemCount={ meta && meta.count ? meta.count : 0 }
                              widgetId="pagination-options-menu-top"
                              perPageOptions={ perPageOptions }
                              perPage={ queryParams.limit }
                              page={ currPage }
                              variant={ PaginationVariant.top }
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
                  { jobsError && <ApiErrorState message={ jobsError } /> }
                  { optionsError && <ApiErrorState message={ optionsError } /> }
                  { !optionsError &&
              (isJobExplorerLoading || isJobExplorerOptionsLoading) && (
                      <LoadingState />
                  ) }
                  { !jobsError &&
              !isJobExplorerLoading &&
              !isJobExplorerOptionsLoading &&
              jobExplorerData.length <= 0 && <NoResults /> }
                  { !jobsError &&
              !isJobExplorerLoading &&
              !isJobExplorerOptionsLoading &&
              jobExplorerData.length > 0 && (
                      <JobExplorerList jobs={ jobExplorerData } />
                  ) }
                  <Pagination
                      itemCount={ meta && meta.count ? meta.count : 0 }
                      widgetId="pagination-options-menu-bottom"
                      perPageOptions={ perPageOptions }
                      perPage={ queryParams.limit }
                      page={ currPage }
                      variant={ PaginationVariant.bottom }
                      onPerPageSelect={ (_event, perPage, page) => {
                          handlePerPageSelect(perPage, page);
                      } }
                      onSetPage={ (_event, pageNumber) => {
                          handleSetPage(pageNumber);
                      } }
                      style={ { marginTop: '20px' } }
                  />
              </CardBody>
          </Card>
      </Main>
    </>
    );
};

JobExplorer.propTypes = {
    location: PropTypes.object,
    history: PropTypes.object
};

export default JobExplorer;
