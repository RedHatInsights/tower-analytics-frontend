import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { parse, stringify } from 'query-string';

import { useQueryParams } from '../../Utilities/useQueryParams';
import useApi from '../../Utilities/useApi';
import { Paths } from '../../paths';

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

const initialQueryParams = {
  ...jobExplorer.defaultParams,
  attributes: jobExplorer.attributes,
};

const JobExplorer = ({ location: { search }, history }) => {
  const [preflightError, setPreFlightError] = useState(null);
  const [
    {
      isLoading,
      isSuccess,
      error,
      data: { meta = {}, items: data = [] },
    },
    setData,
  ] = useApi({ meta: {}, items: [] });
  const [options, setOptions] = useApi({});

  const { queryParams, setFromPagination, setFromToolbar, dispatch } =
    useQueryParams(initialQueryParams);

  const updateURL = () => {
    const { jobExplorer } = Paths;
    const search = stringify(queryParams, { arrayFormat: 'bracket' });
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

    const initialSearchParams = parse(search, {
      arrayFormat: 'bracket',
      parseBooleans: true,
      parseNumbers: true,
    });

    dispatch({
      type: 'REINITIALIZE',
      value: {
        ...initialQueryParams,
        ...initialSearchParams,
      },
    });
  }, []);

  useEffect(() => {
    setData(readJobExplorer({ params: queryParams }));
    setOptions(readJobExplorerOptions({ params: queryParams }));
    updateURL();
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
                categories={options.data}
                filters={queryParams}
                setFilters={setFromToolbar}
                pagination={
                  <Pagination
                    count={meta?.count}
                    params={{
                      limit: queryParams.limit,
                      offset: queryParams.offset,
                    }}
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
                  limit: queryParams.limit,
                  offset: queryParams.offset,
                }}
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
