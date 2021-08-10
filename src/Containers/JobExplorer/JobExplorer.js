import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import { useQueryParams } from '../../Utilities/useQueryParams';
import useRequest from '../../Utilities/useRequest';

import LoadingState from '../../Components/LoadingState';
import NoResults from '../../Components/NoResults';
import ApiErrorState from '../../Components/ApiErrorState';
import Pagination from '../../Components/Pagination';

import { readJobExplorer, readJobExplorerOptions } from '../../Api/';
import { jobExplorer } from '../../Utilities/constants';

import Main from '@redhat-cloud-services/frontend-components/Main';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';

import { Card, CardBody, PaginationVariant } from '@patternfly/react-core';

import JobExplorerList from '../../Components/JobExplorerList';
import FilterableToolbar from '../../Components/Toolbar/';
import { getQSConfig } from '../../Utilities/qs';

const initialQueryParams = {
  ...jobExplorer.defaultParams,
  attributes: jobExplorer.attributes,
};
const qsConfig = getQSConfig('job-explorer', { ...initialQueryParams }, [
  'limit',
  'offset',
]);

const JobExplorer = () => {
  const {
    queryParams,
    setFromPagination,
    setFromToolbar,
    dispatch: queryParamsDispatch,
  } = useQueryParams(qsConfig);

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
    insights.chrome.appNavClick({ id: 'job-explorer', secondaryNav: true });
  }, []);

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
              qsConfig={qsConfig}
              setFilters={setFromToolbar}
              pagination={
                <Pagination
                  count={meta?.count}
                  params={{
                    limit: parseInt(queryParams.limit),
                    offset: parseInt(queryParams.offset),
                  }}
                  qsConfig={qsConfig}
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
              qsConfig={qsConfig}
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
