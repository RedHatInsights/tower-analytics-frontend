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

import {
  preflightRequest,
  readJobExplorer,
  readJobExplorerOptions,
} from '../../Api';
import { jobExplorer } from '../../Utilities/constants';

import Main from '@redhat-cloud-services/frontend-components/Main';
import NotAuthorized from '@redhat-cloud-services/frontend-components/NotAuthorized';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import { notAuthorizedParams } from '../../Utilities/constants';

import {
  Card,
  CardBody,
  Pagination,
  PaginationVariant,
} from '@patternfly/react-core';

import JobExplorerList from '../../Components/JobExplorerList';
import FilterableToolbar from '../../Components/Toolbar/';

const perPageOptions = [
  { title: '5', value: 5 },
  { title: '10', value: 10 },
  { title: '15', value: 15 },
  { title: '20', value: 20 },
  { title: '25', value: 25 },
];

const initialQueryParams = {
  ...jobExplorer.defaultParams,
  attributes: jobExplorer.attributes,
};

const optionsMapper = (options) => {
  const { groupBy, attributes, ...rest } = options;
  return rest;
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
  const [currPage, setCurrPage] = useState(1);
  const [options, setOptions] = useApi({}, optionsMapper);

  const {
    queryParams,
    setLimit,
    setOffset,
    setFromToolbar,
    dispatch,
  } = useQueryParams(initialQueryParams);

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

  const returnOffsetVal = (page) => (page - 1) * queryParams.limit;

  const handleSetPage = (page) => {
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
                    itemCount={meta && meta.count ? meta.count : 0}
                    widgetId="pagination-options-menu-top"
                    perPageOptions={perPageOptions}
                    perPage={queryParams.limit}
                    page={currPage}
                    variant={PaginationVariant.top}
                    onPerPageSelect={(_event, perPage, page) => {
                      handlePerPageSelect(perPage, page);
                    }}
                    onSetPage={(_event, pageNumber) => {
                      handleSetPage(pageNumber);
                    }}
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
                itemCount={meta && meta.count ? meta.count : 0}
                widgetId="pagination-options-menu-bottom"
                perPageOptions={perPageOptions}
                perPage={queryParams.limit}
                page={currPage}
                variant={PaginationVariant.bottom}
                onPerPageSelect={(_event, perPage, page) => {
                  handlePerPageSelect(perPage, page);
                }}
                onSetPage={(_event, pageNumber) => {
                  handleSetPage(pageNumber);
                }}
                style={{ marginTop: '20px' }}
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
