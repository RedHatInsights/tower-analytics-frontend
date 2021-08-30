import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import { useQueryParams } from '../../Utilities/useQueryParams';
import useRequest from '../../Utilities/useRequest';

import LoadingState from '../../Components/ApiStatus/LoadingState';
import NoResults from '../../Components/ApiStatus/NoResults';
import ApiErrorState from '../../Components/ApiStatus/ApiErrorState';
import Pagination from '../../Components/Pagination';

import { readJobExplorer, readJobExplorerOptions } from '../../Api/';
import { jobExplorer } from '../../Utilities/constants';

import Main from '@redhat-cloud-services/frontend-components/Main';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';

import { Card, CardBody, PaginationVariant } from '@patternfly/react-core';

import JobExplorerList from './JobExplorerList';
import FilterableToolbar from '../../Components/Toolbar/';

const JobExplorer = () => {
  const {
    queryParams,
    setFromPagination,
    setFromToolbar,
    dispatch: queryParamsDispatch,
  } = useQueryParams(jobExplorer.defaultParams);

  const {
    result: options,
    error,
    request: fetchOptions,
  } = useRequest(
    useCallback(() => readJobExplorerOptions(queryParams), [queryParams]),
    {}
  );

  const {
    result: { items: data, meta },
    isLoading: dataIsLoading,
    isSuccess: dataIsSuccess,
    request: fetchEndpoints,
  } = useRequest(
    useCallback(() => readJobExplorer(queryParams), [queryParams]),
    { items: [], meta: {} }
  );

  useEffect(() => {
    fetchOptions();
    fetchEndpoints();
  }, [queryParams]);

  if (error) return <ApiErrorState message={error.error} />;

  return (
    <React.Fragment>
      <PageHeader>
        <PageHeaderTitle title={'Job Explorer'} />
      </PageHeader>
      <Main>
        <Card>
          <CardBody>
            <FilterableToolbar
              categories={options}
              filters={queryParams}
              setFilters={setFromToolbar}
              pagination={
                <Pagination
                  count={meta?.count}
                  params={{
                    limit: parseInt(queryParams.limit),
                    offset: parseInt(queryParams.offset),
                  }}
                  setPagination={setFromPagination}
                  isCompact
                />
              }
              hasSettings
            />
            {dataIsLoading && <LoadingState />}
            {dataIsSuccess && data.length <= 0 && <NoResults />}
            {dataIsSuccess && data.length > 0 && (
              <JobExplorerList
                jobs={data}
                queryParams={queryParams}
                queryParamsDispatch={queryParamsDispatch}
              />
            )}
            <Pagination
              count={meta?.count}
              params={{
                limit: parseInt(queryParams.limit),
                offset: parseInt(queryParams.offset),
              }}
              setPagination={setFromPagination}
              variant={PaginationVariant.bottom}
            />
          </CardBody>
        </Card>
      </Main>
    </React.Fragment>
  );
};

JobExplorer.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
};

export default JobExplorer;
