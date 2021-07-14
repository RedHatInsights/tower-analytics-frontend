import React, {useState, useEffect, useCallback} from 'react';
import PropTypes from 'prop-types';

import { useQueryParams } from '../../Utilities/useQueryParams';
import useRequest from "../../Utilities/useRequest";
import {qsToObject, qsToString} from "../../Utilities/helpers";
import { useHistory, useLocation } from "react-router-dom";

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

const JobExplorer = ({ location: { search } }) => {
  const [preflightError, setPreFlightError] = useState(null);
  const history = useHistory();
  const location = useLocation();
  const {pathname} = useLocation();

  let query;
  if (search !== '') {
    query = qsToObject(search)
  } else if (location.search !== '') {
    query = qsToObject(location.search)
  } else {
    query = initialQueryParams
  }
  const { queryParams, setFromPagination, setFromToolbar } = useQueryParams(query);

  // params from url/querystring
  const [urlstring, setUrlstring] = useState(queryParams)

  const {
    result: {
      data,
      meta,
      options
    },
    error,
    isLoading,
    isSuccess,
    request: fetchEndpoints,
  } = useRequest(
    useCallback(async () => {
      await preflightRequest().catch((error) => {
        setPreFlightError({ preflightError: error });
      });

      const [response, optionsResponse] = await Promise.all([
        readJobExplorer({ params: queryParams }),
        readJobExplorerOptions({ params: queryParams }),
      ]);
      return {
        data: response.items,
        meta: response.meta,
        options: optionsResponse
      };
    }, [location]),
    {
      items: [], options: {}
    }
  );

  useEffect(() => {
    insights.chrome.appNavClick({ id: 'job-explorer', secondaryNav: true });

    preflightRequest().catch((error) => {
      setPreFlightError({ preflightError: error });
    });
  }, []);

  useEffect(() => {
    const search = qsToString(queryParams);
    setUrlstring(search)
    history.push(`${pathname}?${search}`)
    fetchEndpoints();
  }, [queryParams, urlstring]);

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
