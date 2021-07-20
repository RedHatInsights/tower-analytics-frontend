import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import { useQueryParams } from '../../Utilities/useQueryParams';
import useRequest from '../../Utilities/useRequest';

import LoadingState from '../../Components/LoadingState';
import EmptyState from '../../Components/EmptyState';
import NoResults from '../../Components/NoResults';
import ApiErrorState from '../../Components/ApiErrorState';
import Pagination from '../../Components/Pagination';
import { Paths } from '../../paths';
import { parse, stringify } from 'query-string';

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

const JobExplorer = ({ location: { search }, history }) => {
  const [preflightError, setPreFlightError] = useState(null);

  const { queryParams, setFromPagination, setFromToolbar } =
    useQueryParams(qsConfig);

  const {
    result: { options },
    error,
    request: fetchOptions,
  } = useRequest(
    useCallback(async () => {
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

  const initialSearchParams = parse(search, {
    arrayFormat: 'bracket',
    parseBooleans: true,
    parseNumbers: true,
  });

  useEffect(() => {
    history.replace({
      pathname: jobExplorer,
      initialSearchParams,
    });
  }, []);

  const updateURL = () => {
    const { jobExplorer } = Paths;
    const search = stringify(
      { ...initialQueryParams, ...initialSearchParams },
      { arrayFormat: 'bracket' }
    );
    history.replace({
      pathname: jobExplorer,
      search,
    });
  };

  useEffect(() => {
    insights.chrome.appNavClick({ id: 'job-explorer', secondaryNav: true });

    preflightRequest().catch((error) => {
      setPreFlightError({ preflightError: error });
    });
  }, []);

  useEffect(() => {
    fetchOptions();
    fetchEndpoints();
    updateURL();
  }, [queryParams]);

  if (preflightError?.preflightError?.status === 403) {
    return <NotAuthorized {...notAuthorizedParams} />;
  }
  if (preflightError?.preflightError) return <EmptyState {...preflightError} />;
  if (error) return <ApiErrorState message={error.error} />;

  return (
    <React.Fragment>
      <PageHeader>
        <PageHeaderTitle title={'Job Explorer'} />
      </PageHeader>

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
              {dataIsLoading && <LoadingState />}
              {dataIsSuccess && data.length <= 0 && <NoResults />}
              {dataIsSuccess && data.length > 0 && (
                <JobExplorerList jobs={data} />
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
      )}
    </React.Fragment>
  );
};

JobExplorer.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
};

export default JobExplorer;
