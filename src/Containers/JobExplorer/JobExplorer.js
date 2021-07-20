import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import { useQueryParams } from '../../Utilities/useQueryParams';
import useRequest from '../../Utilities/useRequest';

import LoadingState from '../../Components/LoadingState';
import EmptyState from '../../Components/EmptyState';
import NoResults from '../../Components/NoResults';
import ApiErrorState from '../../Components/ApiErrorState';
import Pagination from '../../Components/Pagination';

import {
  preflightRequest,
  readJobExplorer,
  readJobExplorerOptions,
} from '../../Api/';
import { jobExplorer } from '../../Utilities/constants';

import Main from '@redhat-cloud-services/frontend-components/Main';
import NotAuthorized from '@redhat-cloud-services/frontend-components/NotAuthorized';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import { notAuthorizedParams } from '../../Utilities/constants';

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
  const [preflightError, setPreFlightError] = useState(null);

  const { queryParams, setFromPagination, setFromToolbar } =
    useQueryParams(qsConfig);

  const {
    result: { options },
    error,
    isLoading,
    isSuccess,
    request: fetchOptions,
  } = useRequest(
    useCallback(async () => {
      await preflightRequest().catch((error) => {
        setPreFlightError({ preflightError: error });
      });
      const response = await readJobExplorerOptions({ params: queryParams });
      return { options: response };
    }, [queryParams]),
    {
      options: {},
    }
  );

  const {
    result: { data, meta },
    error: dataError,
    isLoading: dataIsLoading,
    isSuccess: dataIsSuccess,
    request: fetchEndpoints,
  } = useRequest(
    useCallback(async () => {
      const response = await readJobExplorer({ params: queryParams });
      return {
        data: response.items,
        meta: response.meta,
      };
    }, [queryParams]),
    { items: [], dataError, dataIsLoading, dataIsSuccess }
  );

  useEffect(() => {
    insights.chrome.appNavClick({ id: 'job-explorer', secondaryNav: true });

    preflightRequest().catch((error) => {
      setPreFlightError({ preflightError: error });
    });
  }, []);

  useEffect(() => {
    fetchOptions();
    fetchEndpoints();
  }, [queryParams]);

  if (preflightError?.preflightError?.status === 403) {
    return <NotAuthorized {...notAuthorizedParams} />;
  }

  return (
    <React.Fragment>
      <PageHeader>
        <PageHeaderTitle title={'Job Explorer'} />
      </PageHeader>

      {preflightError && (
        <Main>
          <EmptyState {...preflightError} />
        </Main>
      )}

      {!preflightError && (
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
              {error && <ApiErrorState message={error.error} />}
              {isLoading && <LoadingState />}
              {isSuccess && data.length <= 0 && <NoResults />}
              {isSuccess && data.length > 0 && <JobExplorerList jobs={data} />}
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
      )}
    </React.Fragment>
  );
};

JobExplorer.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
};

export default JobExplorer;
